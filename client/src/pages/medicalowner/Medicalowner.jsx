import React, { useState } from 'react';
import { 
  Store, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Clock, 
  Truck, 
  CreditCard, 
  AlertCircle,
  ChevronRight,
  Check,
  Building
} from 'lucide-react';
import styles from "./Medicalowner.module.css"

const Medicalowner = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    licenseNumber: '',
    contactDetails: {
      phone: '',
      email: '',
      website: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      pinCode: '',
      country: ''
    },
    workingHours: {
      openTime: '',
      closeTime: '',
      daysOpen: []
    },
    deliveryOptions: {
      homeDelivery: false,
      onlineOrders: false
    },
    paymentMethods: {
      acceptsCash: true,
      acceptsCard: false,
      acceptsUPI: false
    },
    emergencyServices: {
      open24Hours: false
    }
  });

  const [submitted, setSubmitted] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        daysOpen: prev.workingHours.daysOpen.includes(day)
          ? prev.workingHours.daysOpen.filter(d => d !== day)
          : [...prev.workingHours.daysOpen, day]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would typically send the data to your backend
    console.log(formData);
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const renderBasicInfo = () => (
    <div className={styles.formSection}>
      <h3>Basic Information</h3>
      <div className={styles.inputGroup}>
        <label>
          <Store size={18} />
          Store Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter store name"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          <User size={18} />
          Owner Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="owner"
          value={formData.owner}
          onChange={handleInputChange}
          placeholder="Enter owner name"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          <AlertCircle size={18} />
          License Number <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleInputChange}
          placeholder="Enter license number"
          required
        />
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className={styles.formSection}>
      <h3>Contact Information</h3>
      <div className={styles.inputGroup}>
        <label>
          <Phone size={18} />
          Phone Number <span className={styles.required}>*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.contactDetails.phone}
          onChange={(e) => handleInputChange(e, 'contactDetails')}
          placeholder="Enter phone number"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          <Mail size={18} />
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.contactDetails.email}
          onChange={(e) => handleInputChange(e, 'contactDetails')}
          placeholder="Enter email address"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          <Globe size={18} />
          Website
        </label>
        <input
          type="url"
          name="website"
          value={formData.contactDetails.website}
          onChange={(e) => handleInputChange(e, 'contactDetails')}
          placeholder="Enter website URL"
        />
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className={styles.formSection}>
      <h3>Address Details</h3>
      <div className={styles.inputGroup}>
        <label>
          <Building size={18} />
          Street Address <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="street"
          value={formData.address.street}
          onChange={(e) => handleInputChange(e, 'address')}
          placeholder="Enter street address"
          required
        />
      </div>

      <div className={styles.gridInputs}>
        <div className={styles.inputGroup}>
          <label>
            <MapPin size={18} />
            City <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={(e) => handleInputChange(e, 'address')}
            placeholder="Enter city"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>
            <MapPin size={18} />
            State <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.address.state}
            onChange={(e) => handleInputChange(e, 'address')}
            placeholder="Enter state"
            required
          />
        </div>
      </div>

      <div className={styles.gridInputs}>
        <div className={styles.inputGroup}>
          <label>
            <MapPin size={18} />
            PIN Code <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="pinCode"
            value={formData.address.pinCode}
            onChange={(e) => handleInputChange(e, 'address')}
            placeholder="Enter PIN code"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>
            <Globe size={18} />
            Country <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.address.country}
            onChange={(e) => handleInputChange(e, 'address')}
            placeholder="Enter country"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderOperationalInfo = () => (
    <div className={styles.formSection}>
      <h3>Operational Details</h3>
      
      <div className={styles.timeSection}>
        <h4>
          <Clock size={18} />
          Working Hours
        </h4>
        <div className={styles.gridInputs}>
          <div className={styles.inputGroup}>
            <label>Opening Time <span className={styles.required}>*</span></label>
            <input
              type="time"
              name="openTime"
              value={formData.workingHours.openTime}
              onChange={(e) => handleInputChange(e, 'workingHours')}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Closing Time <span className={styles.required}>*</span></label>
            <input
              type="time"
              name="closeTime"
              value={formData.workingHours.closeTime}
              onChange={(e) => handleInputChange(e, 'workingHours')}
              required
            />
          </div>
        </div>

        <div className={styles.daysSelection}>
          <label>Working Days <span className={styles.required}>*</span></label>
          <div className={styles.daysGrid}>
            {days.map(day => (
              <button
                key={day}
                type="button"
                className={`${styles.dayButton} ${
                  formData.workingHours.daysOpen.includes(day) ? styles.selected : ''
                }`}
                onClick={() => handleDayToggle(day)}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.optionsSection}>
        <h4>
          <Truck size={18} />
          Delivery Options
        </h4>
        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              name="homeDelivery"
              checked={formData.deliveryOptions.homeDelivery}
              onChange={(e) => handleInputChange(e, 'deliveryOptions')}
            />
            Home Delivery Available
          </label>
          <label>
            <input
              type="checkbox"
              name="onlineOrders"
              checked={formData.deliveryOptions.onlineOrders}
              onChange={(e) => handleInputChange(e, 'deliveryOptions')}
            />
            Accept Online Orders
          </label>
        </div>
      </div>

      <div className={styles.optionsSection}>
        <h4>
          <CreditCard size={18} />
          Payment Methods
        </h4>
        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              name="acceptsCash"
              checked={formData.paymentMethods.acceptsCash}
              onChange={(e) => handleInputChange(e, 'paymentMethods')}
            />
            Accept Cash
          </label>
          <label>
            <input
              type="checkbox"
              name="acceptsCard"
              checked={formData.paymentMethods.acceptsCard}
              onChange={(e) => handleInputChange(e, 'paymentMethods')}
            />
            Accept Cards
          </label>
          <label>
            <input
              type="checkbox"
              name="acceptsUPI"
              checked={formData.paymentMethods.acceptsUPI}
              onChange={(e) => handleInputChange(e, 'paymentMethods')}
            />
            Accept UPI
          </label>
        </div>
      </div>

      <div className={styles.optionsSection}>
        <h4>
          <AlertCircle size={18} />
          Emergency Services
        </h4>
        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              name="open24Hours"
              checked={formData.emergencyServices.open24Hours}
              onChange={(e) => handleInputChange(e, 'emergencyServices')}
            />
            Open 24 Hours
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1>Medical Store Registration</h1>
          <p>Register your medical store to join our network</p>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressSteps}>
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`${styles.step} ${step >= stepNumber ? styles.active : ''} 
                  ${step > stepNumber ? styles.completed : ''}`}
              >
                <div className={styles.stepNumber}>
                  {step > stepNumber ? <Check size={16} /> : stepNumber}
                </div>
                <span className={styles.stepLabel}>
                  {stepNumber === 1 && 'Basic Info'}
                  {stepNumber === 2 && 'Contact'}
                  {stepNumber === 3 && 'Address'}
                  {stepNumber === 4 && 'Operations'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formContent}>
            {step === 1 && renderBasicInfo()}
            {step === 2 && renderContactInfo()}
            {step === 3 && renderAddressInfo()}
            {step === 4 && renderOperationalInfo()}
          </div>

          <div className={styles.formActions}>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className={styles.prevButton}
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className={styles.nextButton}
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button type="submit" className={styles.submitButton}>
                Submit Registration
              </button>
            )}
          </div>
        </form>
      </div>

      {submitted && (
        <div className={styles.successOverlay}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <Check size={48} />
            </div>
            <h2>Registration Successful!</h2>
            <p>Your medical store has been registered successfully.</p>
            <div className={styles.registrationNumber}>
              Registration #: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicalowner;