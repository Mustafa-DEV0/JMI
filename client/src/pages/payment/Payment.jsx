import React, { useState } from 'react';
import { CreditCard, QrCode, Wallet, Check, X, Loader } from 'lucide-react';
import styles from './Payment.module.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStatus(Math.random() > 0.5 ? 'success' : 'error');
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Complete Your Payment</h1>
        
        <div className={styles.paymentMethods}>
          <button
            className={`${styles.methodButton} ${paymentMethod === 'card' ? styles.active : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            <CreditCard className={styles.icon} />
            <span>Card Payment</span>
          </button>
          <button
            className={`${styles.methodButton} ${paymentMethod === 'upi' ? styles.active : ''}`}
            onClick={() => setPaymentMethod('upi')}
          >
            <QrCode className={styles.icon} />
            <span>UPI Payment</span>
          </button>
          <button
            className={`${styles.methodButton} ${paymentMethod === 'cod' ? styles.active : ''}`}
            onClick={() => setPaymentMethod('cod')}
          >
            <Wallet className={styles.icon} />
            <span>Cash on Delivery</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {paymentMethod === 'card' && (
            <div className={styles.cardInputs}>
              <div className={styles.inputGroup}>
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  maxLength="19"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    maxLength="5"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    maxLength="3"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className={styles.upiInputs}>
              <div className={styles.inputGroup}>
                <label>UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  placeholder="username@upi"
                  value={formData.upiId}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className={styles.codInputs}>
              <div className={styles.inputGroup}>
                <label>Delivery Address</label>
                <textarea
                  name="address"
                  placeholder="Enter your full delivery address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={styles.textarea}
                />
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitButton} disabled={status === 'processing'}>
            {status === 'processing' && <Loader className={styles.spinner} />}
            {status === 'success' && <Check className={styles.statusIcon} />}
            {status === 'error' && <X className={styles.statusIcon} />}
            {status === 'idle' && 'Pay Now'}
            {status === 'processing' && 'Processing...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'error' && 'Payment Failed'}
          </button>
        </form>

        <div className={styles.secureNote}>
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;