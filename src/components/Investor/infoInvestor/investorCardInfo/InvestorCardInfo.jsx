import React from 'react';
import styles from './InvestorCardInfo.module.css';

function InvestorCardInfo({ name, direction, city, department, country, cp, phone, email }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>User Info</div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Name:</div>
          <div className={styles.value}>{name}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Direction:</div>
          <div className={styles.value}>{direction}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>City:</div>
          <div className={styles.value}>{city}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Department:</div>
          <div className={styles.value}>{department}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Country:</div>
          <div className={styles.value}>{country}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Postal Code:</div>
          <div className={styles.value}>{cp}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Phone:</div>
          <div className={styles.value}>{phone}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Email:</div>
          <div className={styles.value}>{email}</div>
        </div>
      </div>
    </div>
  );
}

export default InvestorCardInfo;
