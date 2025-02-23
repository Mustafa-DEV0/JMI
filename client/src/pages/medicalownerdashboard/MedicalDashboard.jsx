import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import styles from './MedicalDashboard.module.css';
import { useParams } from 'react-router-dom';

function App() {
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  // Fetch medical store details and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching orders for Medical Store ID:", id);
  
        const [storeResponse, ordersResponse] = await Promise.all([
          axios.get(`http://localhost:5000/medicalowner/details/${id}`),
          axios.get(`http://localhost:5000/medicalowner/orders/${id}`)
        ]);
  
        console.log("Store Response:", storeResponse.data);
        console.log("Orders Response:", ordersResponse.data);
  
        setStore(storeResponse.data.medicalStore);
        setOrders(ordersResponse.data.orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);  // Ensure `id` is added as a dependency  
  

  const handleOrderStatusChange = async (orderId, newStatus, billImage = null) => {
    try {
      let requestData;
      let headers = { 'Content-Type': 'application/json' };
  
      if (newStatus === 'Confirmed') {
        requestData = { status: newStatus };
      } else if (newStatus === 'Delivered' && billImage) {
        // If updating to "Delivered" and an image is provided, use FormData
        requestData = new FormData();
        requestData.append('status', newStatus);
        requestData.append('billImage', billImage);
        headers = { 'Content-Type': 'multipart/form-data' };
      }
  
      const response = await axios.patch(
        `http://localhost:5000/medicalowner/orders/${orderId}/status`,
        requestData,
        { headers }
      );
  
      // Update the UI
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
  
      toast.success(`Order ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };
  
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file && selectedOrder) {
      try {
        const formData = new FormData();
        formData.append('status', 'Delivered');
        formData.append('billImage', file);

        await axios.patch(
          `${API_URL}/medical/orders/${selectedOrder._id}/status`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === selectedOrder._id
              ? { ...order, status: 'Delivered', billImage: URL.createObjectURL(file) }
              : order
          )
        );
        setShowUploadModal(false);
        setSelectedOrder(null);
        toast.success('Order completed successfully');
      } catch (error) {
        toast.error('Failed to upload bill');
        console.error('Error uploading bill:', error);
      }
    }
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status.toLowerCase() === selectedStatus.toLowerCase());

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!store) {
    return <div className={styles.error}>Failed to load medical store data</div>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.storeInfo}>
            <h1>{store.name}</h1>
            <p className={styles.licenseNumber}>License: {store.licenseNumber}</p>
          </div>
          <div className={styles.quickInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Pending</span>
              <span className={styles.value}>
                {orders.filter(o => o.status === 'Pending').length}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Confirmed</span>
              <span className={styles.value}>
                {orders.filter(o => o.status === 'Confirmed').length}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Delivered</span>
              <span className={styles.value}>
                {orders.filter(o => o.status === 'Delivered').length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.storeDetails}>
          <div className={styles.storeImage}>
            <img src={store.medicalImage} alt={store.name} />
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <div className={styles.cardIcon}>👤</div>
              <h3>Owner Information</h3>
              <p>{store.owner}</p>
              <p>{store.contactDetails.phone}</p>
              <p>{store.contactDetails.email}</p>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.cardIcon}>📍</div>
              <h3>Location</h3>
              <p>{store.address.street}</p>
              <p>{store.address.city}, {store.address.state} {store.address.pinCode}</p>
              <p>{store.address.country}</p>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.cardIcon}>⏰</div>
              <h3>Working Hours</h3>
              <p>{store.workingHours.openTime} - {store.workingHours.closeTime}</p>
              <p className={styles.days}>{store.workingHours.daysOpen.join(', ')}</p>
            </div>

            <div className={styles.detailCard}>
              <div className={styles.cardIcon}>💳</div>
              <h3>Payment & Services</h3>
              <div className={styles.features}>
                {store.paymentMethods.acceptsCash && <span>Cash</span>}
                {store.paymentMethods.acceptsCard && <span>Card</span>}
                {store.paymentMethods.acceptsUPI && <span>UPI</span>}
                {store.deliveryOptions.homeDelivery && <span>Delivery</span>}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ordersSection}>
          <div className={styles.orderHeader}>
            <h2>Orders Management</h2>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending Orders</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className={styles.ordersList}>
            {filteredOrders.map(order => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <span className={`${styles.status} ${styles[`status${order.status}`]}`}>
                    {order.status}
                  </span>
                  <span className={styles.orderDate}>
                    {new Date(order.orderedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.orderContent}>
                  <div className={styles.orderPatient}>
                    <h4>{order.patient.name}</h4>
                    <p>Order #{order._id.slice(-6)}</p>
                  </div>

                  <div className={styles.orderItems}>
                    {order.medicines.map((med, index) => (
                      <span key={index} className={styles.item}>
                        {med.name} (x{med.quantity})
                      </span>
                    ))}
                  </div>

                  <div className={styles.orderDocs}>
                    <a 
                      href={order.prescriptionImage} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.docLink}
                    >
                      View Prescription
                    </a>
                    {order.billImage && (
                      <a 
                        href={order.billImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.docLink}
                      >
                        View Bill
                      </a>
                    )}
                  </div>

                  <div className={styles.orderActions}>
                    {order.status === 'Pending' && (
                      <button 
                        onClick={() => handleOrderStatusChange(order._id, 'Confirmed')}
                        className={styles.actionButton}
                      >
                        Confirm Order
                      </button>
                    )}
                    {order.status === 'Confirmed' && (
                      <button 
                        onClick={() => handleOrderStatusChange(order._id, 'Delivered')}
                        className={styles.actionButton}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showUploadModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Upload Bill</h3>
            <p>Please upload the bill image to complete the order</p>
            <div className={styles.uploadArea}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className={styles.fileInput}
              />
              <p className={styles.uploadHint}>Click to select or drag & drop image</p>
            </div>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowUploadModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;