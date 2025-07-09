import styles from "./Footer.module.css"

function Footer() {

  return (
    <div className={styles.footer}>
      <div className={styles.logo}>
        <a href={"/"}>
          <img src="/logo-silverfork.png" width="50px"/>
        </a>
      </div>
      <div className={styles.company}>
        A SAMURAI Inc. Product<br/>
        <div className={styles.companyDetails}>Hacettepe University BBM384 2025 Project</div>
      </div>
      <div className={styles.developers}>
        Deniz Can Aksuoğlu<br/>
        Berkay Saylak<br/>
        Muhammed Ali Uzun<br/>
      </div>
      <div className={styles.developers}>
        Fırat Altun<br/>
        Ali Buğra Sarıkaya
      </div>
    </div>
  );
}

export default Footer;
