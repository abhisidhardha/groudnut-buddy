import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess, loginFailure } from '../../store/authSlice';
import './LoginSignup.css';

const LoginSignup = () => {
  // Hooks must be called at the top level of the component
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [phone, setPhone] = useState('');
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const otpInputRefs = useRef([]);

  // Initialize refs for OTP inputs
  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, 6);
  }, []);

  const handleLoginSuccess = () => {
    const redirectTo = new URLSearchParams(location.search).get('redirect') || '/scan';
    navigate(redirectTo);
  };

  const sendOtp = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/send-otp', { phone: `+91${phone}` });
      setStep(2);
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 1) {
      const newOtpArray = [...otpArray];
      newOtpArray[index] = value;
      setOtpArray(newOtpArray);
      if (value && index < 5) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = e => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtpArray = [...otpArray];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newOtpArray[i] = pastedData[i];
      }
      setOtpArray(newOtpArray);
      const nextEmptyIndex = newOtpArray.findIndex(val => val === '');
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        otpInputRefs.current[nextEmptyIndex].focus();
      } else {
        otpInputRefs.current[5].focus();
      }
    }
  };

  const verifyOtp = async e => {
    e.preventDefault();
    const otpValue = otpArray.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/verify-otp', {
        phone: `+91${phone}`,
        code: otpValue,
      });

      if (res.data.success) {
        dispatch(
          loginSuccess({
            phone: `+91${phone}`,
            username: res.data.username,
            token: res.data.token,
          })
        );
        handleLoginSuccess();
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
      setError(err.response?.data?.error || 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-signup">
      <div className="login-container">
        <h2>Login / Signup</h2>
        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <div className="input-group">
              <div className="phone-input-container">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>
            </div>
            <button className="login-btn" type="submit" disabled={loading || phone.length !== 10}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <p className="otp-sent-text">
              OTP sent to <strong>+91 {phone}</strong>
            </p>
            <div className="otp-input-group">
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  ref={el => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-input"
                  value={digit}
                  onChange={e => handleOtpChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : null}
                  autoComplete="off"
                />
              ))}
            </div>
            <button
              className="login-btn"
              type="submit"
              disabled={loading || otpArray.join('').length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <p className="resend-text">
              Didn't receive OTP?{' '}
              <button type="button" className="resend-btn" onClick={() => setStep(1)}>
                Resend
              </button>
            </p>
          </form>
        )}
        {error && <div className="error-message">{error}</div>}

      </div>
    </div>
  );
};

export default LoginSignup;
