import { useState } from 'react';
import styles from './MedicalDashboard.module.css';

const DUMMY_MEDICAL_STORE = {
  name: "HealthCare Pharmacy",
  owner: "Dr. John Smith",
  medicalImage: "https://placehold.co/1200x400/67B7D1/ffffff?text=HealthCare+Pharmacy",
  licenseNumber: "MED123456",
  contactDetails: {
    phone: "+1 234-567-8900",
    email: "contact@healthcarepharmacy.com",
    website: "www.healthcarepharmacy.com"
  },
  address: {
    street: "123 Medical Avenue",
    city: "New York",
    state: "NY",
    pinCode: "10001",
    country: "USA"
  },
  workingHours: {
    openTime: "09:00",
    closeTime: "21:00",
    daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  deliveryOptions: {
    homeDelivery: true,
    onlineOrders: true
  },
  paymentMethods: {
    acceptsCash: true,
    acceptsCard: true,
    acceptsUPI: true
  },
  emergencyServices: {
    open24Hours: false
  }
};

const INITIAL_ORDERS = [
  {
    id: 1,
    patientName: "Alice Johnson",
    prescription: "prescription1.pdf",
    status: "new",
    items: ["Paracetamol", "Vitamin C"],
    date: "2024-03-15",
    billImage: null
  },
  {
    id: 2,
    patientName: "Bob Wilson",
    prescription: "prescription2.pdf",
    status: "processing",
    items: ["Antibiotics", "Cough Syrup"],
    date: "2024-03-14",
    billImage: null
  },
  {
    id: 3,
    patientName: "Carol Smith",
    prescription: "prescription3.pdf",
    status: "completed",
    items: ["Pain Relief Gel", "Bandages"],
    date: "2024-03-13",
    billImage: "bill3.jpg"
  }
];

function MedicalDashboard() {
  const [store] = useState(DUMMY_MEDICAL_STORE);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleOrderStatusChange = (orderId, newStatus) => {
    if (newStatus === 'processing') {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } else if (newStatus === 'completed') {
      setSelectedOrder(orders.find(order => order.id === orderId));
      setShowUploadModal(true);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && selectedOrder) {
      const imageUrl = URL.createObjectURL(file);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrder.id 
            ? { ...order, status: 'completed', billImage: imageUrl }
            : order
        )
      );
      setShowUploadModal(false);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return styles.statusNew;
      case 'processing': return styles.statusProcessing;
      case 'completed': return styles.statusCompleted;
      default: return '';
    }
  };

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
              <span className={styles.label}>New Orders</span>
              <span className={styles.value}>{orders.filter(o => o.status === 'new').length}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Processing</span>
              <span className={styles.value}>{orders.filter(o => o.status === 'processing').length}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Completed</span>
              <span className={styles.value}>{orders.filter(o => o.status === 'completed').length}</span>
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
              <option value="new">New Orders</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.ordersList}>
            {filteredOrders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <span className={`${styles.status} ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={styles.orderDate}>{order.date}</span>
                </div>

                <div className={styles.orderContent}>
                  <div className={styles.orderPatient}>
                    <h4>{order.patientName}</h4>
                    <p>Order #{order.id}</p>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item, index) => (
                      <span key={index} className={styles.item}>{item}</span>
                    ))}
                  </div>

                  <div className={styles.orderDocs}>
                    <a href="#" className={styles.docLink}>
                      View Prescription
                    </a>
                    {order.billImage && (
                      <a href="#" className={styles.docLink}>
                        View Bill
                      </a>
                    )}
                  </div>

                  <div className={styles.orderActions}>
                    {order.status === 'new' && (
                      <button 
                        onClick={() => handleOrderStatusChange(order.id, 'processing')}
                        className={styles.actionButton}
                      >
                        Accept Order
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button 
                        onClick={() => handleOrderStatusChange(order.id, 'completed')}
                        className={styles.actionButton}
                      >
                        Complete Order
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
    </div>
  );
}

export default MedicalDashboard;