import React from 'react';
import styles from './Toast.module.css';

const Toast = ({ message = '', type = 'success', visible = false, onClose = () => {} }) => {
  if (!visible || !message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]} ${visible ? styles.visible : ''}`} role="status" aria-live="polite">
      <div className={styles.message}>{message}</div>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar notificação">×</button>
    </div>
  );
};

export default Toast;
