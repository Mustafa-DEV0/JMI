import React, { useState,useCallback } from 'react';
import styles from './MedicalDetails.module.css';
import { Clock, MapPin, Phone, Mail, CreditCard, Wallet, Smartphone, Truck, ShoppingBag, Upload, Check} from 'lucide-react';
import axios from 'axios';
import { useParams , useNavigate } from 'react-router-dom';   
import FormData from 'form-data';


const MedicalDetails = () => {
  const [image, setimage] = useState(null)
  const [imageurl, setimageurl] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    licenseNumber: '',
    contactDetails: {
      phone: '',
      email: ''
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
      acceptsCash: false,
      acceptsCard: false,
      acceptsUPI: false
    },
    imageUrl: ''
  });

  console.log("form url:",formData.imageUrl)

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e, section, field) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: e.target.value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  const handleCheckboxChange = (section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const handleDaySelection = (day) => {
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

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
  
    setimage(file);
    
    
    const formData = new FormData();
    formData.append("image", file); // ✅ Changed 'file' to 'image'
    
    try {
      // Step 1: Upload image to backend
      const res = await axios.post("http://localhost:5000/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      
      setimageurl(res.data)
      
      setFormData(prev => ({...prev, imageUrl: res.data}))
     
     
  
      
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload image ");
    }
  }, []);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `http://localhost:5000/medicalowner/details/${id}`,
        {
         formData
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      setTimeout(() => {
        navigate(`/patient/dashboard/${id}`);
      }, 2000);
    } catch (error) {
      alert("Failed to save details");
      console.error("Error:", error);
    }

    console.log(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h1 className={styles.title}>Medical Store Details</h1>
          <p className={styles.subtitle}>Complete your store profile</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Left Column */}
            <div className={styles.formColumn}>
              {/* Basic Information */}
              <div className={styles.section}>
                <h2>Store Information</h2>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange(e, null, 'name')}
                    placeholder="Store Name"
                    required
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => handleInputChange(e, null, 'owner')}
                    placeholder="Owner Name"
                    required
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange(e, null, 'licenseNumber')}
                    placeholder="License Number"
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className={styles.section}>
                <h2>Contact Information</h2>
                <div className={styles.inputGroup}>
                  <div className={styles.inputWithIcon}>
                    <Phone className={styles.inputIcon} />
                    <input
                      type="tel"
                      value={formData.contactDetails.phone}
                      onChange={(e) => handleInputChange(e, 'contactDetails', 'phone')}
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                  <div className={styles.inputWithIcon}>
                    <Mail className={styles.inputIcon} />
                    <input
                      type="email"
                      value={formData.contactDetails.email}
                      onChange={(e) => handleInputChange(e, 'contactDetails', 'email')}
                      placeholder="Email Address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className={styles.section}>
                <h2>Working Hours</h2>
                <div className={styles.timeSection}>
                  <div className={styles.timeInputs}>
                    <div className={styles.inputWithIcon}>
                      <Clock className={styles.inputIcon} />
                      <input
                        type="time"
                        value={formData.workingHours.openTime}
                        onChange={(e) => handleInputChange(e, 'workingHours', 'openTime')}
                        required
                      />
                    </div>
                    <span>to</span>
                    <div className={styles.inputWithIcon}>
                      <Clock className={styles.inputIcon} />
                      <input
                        type="time"
                        value={formData.workingHours.closeTime}
                        onChange={(e) => handleInputChange(e, 'workingHours', 'closeTime')}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.daysSelection}>
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        type="button"
                        className={`${styles.dayButton} ${
                          formData.workingHours.daysOpen.includes(day) ? styles.selected : ''
                        }`}
                        onClick={() => handleDaySelection(day)}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.formColumn}>
              {/* Address */}
              <div className={styles.section}>
                <h2>Store Location</h2>
                <div className={styles.inputGroup}>
                  <div className={styles.inputWithIcon}>
                    <MapPin className={styles.inputIcon} />
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange(e, 'address', 'street')}
                      placeholder="Street Address"
                      required
                    />
                  </div>
                  <div className={styles.addressGrid}>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange(e, 'address', 'city')}
                      placeholder="City"
                      required
                    />
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange(e, 'address', 'state')}
                      placeholder="State"
                      required
                    />
                    <input
                      type="text"
                      value={formData.address.pinCode}
                      onChange={(e) => handleInputChange(e, 'address', 'pinCode')}
                      placeholder="PIN Code"
                      required
                    />
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) => handleInputChange(e, 'address', 'country')}
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Services & Payment */}
              <div className={styles.section}>
                <h2>Services & Payment</h2>
                <div className={styles.optionsContainer}>
                  <div className={styles.optionsGroup}>
                    <h3>Delivery Services</h3>
                    <div className={styles.optionsGrid}>
                      <button
                        type="button"
                        className={`${styles.optionCard} ${formData.deliveryOptions.homeDelivery ? styles.selected : ''}`}
                        onClick={() => handleCheckboxChange('deliveryOptions', 'homeDelivery')}
                      >
                        <span className={styles.optionContent}>
                          <Truck className={styles.optionIcon} />
                          <span>Home Delivery</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.optionCard} ${formData.deliveryOptions.onlineOrders ? styles.selected : ''}`}
                        onClick={() => handleCheckboxChange('deliveryOptions', 'onlineOrders')}
                      >
                        <span className={styles.optionContent}>
                          <ShoppingBag className={styles.optionIcon} />
                          <span>Online Orders</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.optionsGroup}>
                    <h3>Payment Methods</h3>
                    <div className={styles.optionsGrid}>
                      <button
                        type="button"
                        className={`${styles.optionCard} ${formData.paymentMethods.acceptsCash ? styles.selected : ''}`}
                        onClick={() => handleCheckboxChange('paymentMethods', 'acceptsCash')}
                      >
                        <span className={styles.optionContent}>
                          <Wallet className={styles.optionIcon} />
                          <span>Cash</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.optionCard} ${formData.paymentMethods.acceptsCard ? styles.selected : ''}`}
                        onClick={() => handleCheckboxChange('paymentMethods', 'acceptsCard')}
                      >
                        <span className={styles.optionContent}>
                          <CreditCard className={styles.optionIcon} />
                          <span>Card</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.optionCard} ${formData.paymentMethods.acceptsUPI ? styles.selected : ''}`}
                        onClick={() => handleCheckboxChange('paymentMethods', 'acceptsUPI')}
                      >
                        <span className={styles.optionContent}>
                          <Smartphone className={styles.optionIcon} />
                          <span>UPI</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.uploadSection}>
            <label>Upload Pharmacy Image <span className={styles.required}>*</span></label>
            <div className={`${styles.uploadBox} ${image ? styles.hasFile : ''}`}>
              <Upload size={24} />
              <p>Drag & drop or click to upload</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
           
            {image && !imageurl && (
              <p>Uploading...</p>
            )}

            {imageurl && (
              <p className={styles.fileName}>
                {image.name} <Check size={16} className={styles.checkIcon} />
              </p> 
            )}
          </div>        


          </div>

          <button type="submit" className={styles.submitButton}>
            Save Store Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalDetails;