import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Clock, Phone, Globe, CreditCard, Truck, AlertCircle } from 'lucide-react';
import styles from './MedicalStore.module.css';







const cities = ["All Cities", "Boston", "Cambridge", "Somerville", "Brookline"];
const states = ["All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"];

function MedicalStore() {

  const [medicalStores, setmedicalStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedState, setSelectedState] = useState('All States');
  const [delivery, setDelivery] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [onlineOrder, setOnlineOrder] = useState(false);
  const [selectedDay, setSelectedDay] = useState('All Days');

  const daysOfWeek = [
    'All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
const navigate = useNavigate();
  const handleSelectStore = (storeId) => {
    navigate(`/medicalorder/${storeId}`);
  };

  useEffect(() => {
    const fetchMedicalStores = async () => {
      setLoading(true);

      try{
        const response = await axios.get('http://localhost:5000/medicalowner/medicalstores/',{
          params: {
            search: searchQuery,
            city: selectedCity !== 'All Cities' ? selectedCity : undefined,
            state: selectedState !== 'All States' ? selectedState : undefined,
            homeDelivery: delivery || undefined,
            onlineOrder: onlineOrder || undefined,
            emergencyServices: emergency || undefined,
            daysOpen: selectedDay !== 'All Days' ? selectedDay : undefined
          }
        });
        
        setmedicalStores(Array.isArray(response.data) ? response.data : []);
       
      } catch (error) {
        setError("Failed to fetch stores")
      }
      setLoading(false);
    };

    fetchMedicalStores();
  },[searchQuery, selectedCity, selectedState, delivery, onlineOrder, emergency, selectedDay]);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.filtersTitle}>Filters</h2>
        
        <div className={styles.filterSection}>
          <h3>Location</h3>
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={styles.select}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className={styles.select}
          >
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Availability</h3>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className={styles.select}
          >
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterSection}>
          <h3>Services</h3>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={delivery}
                onChange={(e) => setDelivery(e.target.checked)}
              />
              Home Delivery
            </label>
            <label>
              <input
                type="checkbox"
                checked={onlineOrder}
                onChange={(e) => setOnlineOrder(e.target.checked)}
              />
              Online Orders
            </label>
            <label>
              <input
                type="checkbox"
                checked={emergency}
                onChange={(e) => setEmergency(e.target.checked)}
              />
              24/7 Emergency Services
            </label>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search medical stores by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.resultCount}>
          {medicalStores.length} Medical Stores Found
        </div>
        <div className={styles.storeGrid}>
          {medicalStores.map(store => (
            <div key={store.id} className={styles.storeCard}>
              <div className={styles.storeImage}>
                <img src={store.imageUrl} alt={store.name} />
                {/* { {store.emergencyServices.open24Hours && (
                  <div className={styles.emergencyBadge}>
                    <AlertCircle size={16} /> 24/7 Emergency
                  </div>
                )} } */}
              </div>
              
              <div className={styles.storeInfo}>
                <h3>{store.name}</h3>
                <p className={styles.owner}>Owned by {store.owner}</p>
                
                <div className={styles.metadata}>
                  <div className={styles.metaItem}>
                    <MapPin className={styles.icon} />
                    <span>{store.address.street}, {store.address.city}, {store.address.state}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock className={styles.icon} />
                    <span>{store.workingHours.openTime} - {store.workingHours.closeTime}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Phone className={styles.icon} />
                    <span>{store.contactDetails.phone}</span>
                  </div>
                  {store.contactDetails.website && (
                    <div className={styles.metaItem}>
                      <Globe className={styles.icon} />
                      <span>{store.contactDetails.website}</span>
                    </div>
                  )}
                </div>

                <div className={styles.services}>
                  <div className={styles.serviceItem}>
                    <Truck className={styles.icon} />
                    <span>{store.deliveryOptions.homeDelivery ? 'Delivery Available' : 'No Delivery'}</span>
                  </div>
                  <div className={styles.serviceItem}>
                    <CreditCard className={styles.icon} />
                    <span>
                      {[
                        store.paymentMethods.acceptsCash && 'Cash',
                        store.paymentMethods.acceptsCard && 'Card',
                        store.paymentMethods.acceptsUPI && 'UPI'
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>

                <div className={styles.workingDays}>
                  <h4>Open Days</h4>
                  <div className={styles.days}>
                    {store.workingHours.daysOpen.map(day => (
                      <span key={day} className={styles.day}>{day.slice(0, 3)}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectStore(store._id)}
                  className={styles.selectButton}
                >
                  Upload Prescription & Order Medicines
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MedicalStore;