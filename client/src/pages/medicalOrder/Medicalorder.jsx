import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Minus, Upload, Search, Check, AlertCircle, Trash2, ShoppingCart } from 'lucide-react';
import styles from './MedicalOrder.module.css';

const MedicineEntry = ({ 
  medicine, 
  onUpdate, 
  onRemove, 
  index,
  isLast,
  onAddMore 
}) => {
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
  const [medicines, setMedicines] = useState([
    { id: Date.now(), name: '', quantity: 1 }
  ]);
  const [prescription, setPrescription] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const handlePrescriptionUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPrescription(file);
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, []);

  const addMedicine = useCallback(() => {
    setMedicines(prev => [
      ...prev,
      { id: Date.now(), name: '', quantity: 1 }
    ]);
  }, []);

  const updateMedicine = useCallback((index, updatedMedicine) => {
    setMedicines(prev => prev.map((medicine, i) => 
      i === index ? updatedMedicine : medicine
    ));
  }, []);

  const removeMedicine = useCallback((index) => {
    setMedicines(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!prescription) {
      setShowError(true);
      return;
    }

    const isValid = medicines.every(medicine => medicine.name.trim() && medicine.quantity > 0);
    if (!isValid) {
      setShowError(true);
      return;
    }

    setIsSearching(true);
    setShowError(false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = medicines.map(medicine => ({
      ...medicine,
      available: true,
      price: Math.floor(Math.random() * 50) + 10,
      manufacturer: ["PharmaCorp", "MediCare", "HealthPlus"][Math.floor(Math.random() * 3)],
      expiryDate: "2025-12-31"
    }));

    setSearchResults(results);
    setIsSearching(false);
    
    const total = results.reduce((sum, medicine) => sum + (medicine.price * medicine.quantity), 0);
    setCartTotal(total);
  }, [medicines, prescription]);

  const handleOrder = useCallback(() => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setMedicines([{ id: Date.now(), name: '', quantity: 1 }]);
      setPrescription(null);
      setSearchResults(null);
      setCartTotal(0);
    }, 3000);
  }, []);

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
              key={medicine.id}
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
              <input
                type="file"
                accept="image/*"
                onChange={handlePrescriptionUpload}
              />
            </div>
            {prescription && (
              <p className={styles.fileName}>
                {prescription.name} <Check size={16} className={styles.checkIcon} />
              </p>
            )}
          </div>

          <button 
            className={`${styles.searchButton} ${isSearching ? styles.searching : ''}`}
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <div className={styles.spinner}></div>
                Checking Availability...
              </>
            ) : (
              <>
                <Search size={20} />
                Check Availability
              </>
            )}
          </button>
        </div>

        {showError && (
          <div className={`${styles.error} ${styles.shake}`}>
            <AlertCircle size={20} />
            Please fill in all medicine details and upload a valid prescription
          </div>
        )}

        {searchResults && (
          <div className={styles.resultSection}>
            <h2>Medicine Details</h2>
            <div className={styles.resultsList}>
              {searchResults.map((result, index) => (
                <div key={index} className={styles.resultCard}>
                  <div className={styles.medicineInfo}>
                    <div>
                      <h3>{result.name}</h3>
                      <p><strong>Manufacturer:</strong> {result.manufacturer}</p>
                      <p><strong>Expiry:</strong> {result.expiryDate}</p>
                    </div>
                    <div className={styles.priceInfo}>
                      <p className={styles.price}>${result.price}</p>
                      <p className={styles.quantity}>Qty: {result.quantity}</p>
                      <p className={styles.subtotal}>
                        Subtotal: ${result.price * result.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.orderSummary}>
              <div className={styles.totalAmount}>
                <ShoppingCart size={24} />
                <div>
                  <p>Total Amount</p>
                  <h3>${cartTotal}</h3>
                </div>
              </div>
              <button 
                className={styles.orderButton}
                onClick={handleOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>

      {orderPlaced && (
        <div className={styles.orderSuccess}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <Check size={48} />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Your medicines will be delivered soon.</p>
            <div className={styles.orderNumber}>
              Order #: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalOrder;