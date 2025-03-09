import React, { useState, useCallback } from 'react';
import { Plus, Minus, Upload, Search, Check, AlertCircle, Trash2, ShoppingCart } from 'lucide-react';
import styles from './MedicalOrder.module.css';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import FormData from "form-data";

const MedicineEntry = ({ medicine, onUpdate, onRemove, index, isLast, onAddMore }) => {
  return (
    <div className={`${styles.medicineEntry} ${styles.slideIn}`}>
      <div className={styles.medicineHeader}>
        <h3>Medicine #{index + 1}</h3>
        <button 
          className={styles.removeButton} 
          onClick={onRemove}
          aria-label="Remove medicine"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className={styles.inputGroup}>
        <label>Medicine Name</label>
        <input
          type="text"
          value={medicine.name}
          onChange={(e) => onUpdate({ ...medicine, name: e.target.value })}
          placeholder="Enter medicine name"
          className={styles.input}
        />
      </div>

      <div className={styles.quantityControl}>
        <label>Quantity</label>
        <div className={styles.quantityWrapper}>
          <button
            className={styles.quantityButton}
            onClick={() => onUpdate({ ...medicine, quantity: Math.max(1, medicine.quantity - 1) })}
            disabled={medicine.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            min="1"
            value={medicine.quantity}
            onChange={(e) => onUpdate({ ...medicine, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
            className={styles.quantityInput}
          />
          <button
            className={styles.quantityButton}
            onClick={() => onUpdate({ ...medicine, quantity: medicine.quantity + 1 })}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {isLast && (
        <button className={styles.addMoreButton} onClick={onAddMore}>
          <Plus size={20} />
          Add Another Medicine
        </button>
      )}
    </div>
  );
};

const MedicalOrder = () => {
  const [medicines, setMedicines] = useState([{ name: '', quantity: 1 }]);
  const [prescription, setPrescription] = useState(null);
  const [prescriptionUrl, setPrescriptionUrl] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const addMedicine = useCallback(() => {
    setMedicines(prev => [...prev, { name: '', quantity: 1 }]);
  }, []);

  const updateMedicine = useCallback((index, updatedMedicine) => {
    setMedicines(prev => prev.map((medicine, i) => i === index ? updatedMedicine : medicine));
  }, []);

  const removeMedicine = useCallback((index) => {
    setMedicines(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handlePrescriptionUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
  
    setPrescription(file);
    setShowError(false);
    
    const formData = new FormData();
    formData.append("image", file); // ✅ Changed 'file' to 'image'
    
    try {
      // Step 1: Upload image to backend
      const res = await axios.post("http://localhost:5000/patient/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setPrescriptionUrl(res.data)
      
     
     
  
      
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload image ");
    }
  }, []); // ✅ Added medicine as a dependency
  
const {id} = useParams();

  const handleOrder = async () => {
   
    if (!prescriptionUrl || medicines.some(m => !m.name.trim() || m.quantity < 1)) {
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        patient: id, // Replace with actual patient ID from auth
        medical: "67ba47fb68946dafbf88c4bc", // Replace with selected medical shop ID
        medicines: medicines.map(m => ({
          name: m.name.trim(),
          quantity: parseInt(m.quantity)
        })),
        prescriptionImage: prescriptionUrl,
      };

      const response = await axios.post(`http://localhost:5000/patient/order/${id}`, orderData);
      
      // Reset form on success
      setMedicines([{ name: '', quantity: 1 }]);
      setPrescription(null);
      setPrescriptionUrl('');
      setShowError(false);
      alert('Order placed successfully! Order ID: ' + response.data.orderId);
    } catch (error) {
      console.error('Error placing order:', error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Upload Prescription & Order Medicines</h1>
        <p>Add your medicines and upload prescription to check availability</p>
      </div>

      <div className={styles.orderForm}>
        <div className={styles.formSection}>
          {medicines.map((medicine, index) => (
            <MedicineEntry
              key={index}
              medicine={medicine}
              index={index}
              onUpdate={(updated) => updateMedicine(index, updated)}
              onRemove={() => removeMedicine(index)}
              isLast={index === medicines.length - 1}
              onAddMore={addMedicine}
            />
          ))}

          <div className={styles.uploadSection}>
            <label>Upload Prescription <span className={styles.required}>*</span></label>
            <div className={`${styles.uploadBox} ${prescription ? styles.hasFile : ''}`}>
              <Upload size={24} />
              <p>Drag & drop or click to upload</p>
              <input type="file" accept="image/*" onChange={handlePrescriptionUpload} />
            </div>
           
            {prescription && !prescriptionUrl && (
              <p>Uploading...</p>
            )}

            {prescriptionUrl && (
              <p className={styles.fileName}>
                {prescription.name} <Check size={16} className={styles.checkIcon} />
              </p>
            )}
          </div>

          <button 
            className={`${styles.orderButton} ${loading ? styles.loading : ''}`} 
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <ShoppingCart size={20} /> Place Order
              </>
            )}
          </button>
        </div>

        {showError && (
          <div className={`${styles.error} ${styles.shake}`}>
            <AlertCircle size={20} /> Please fill in all medicine details and upload a valid prescription
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalOrder;