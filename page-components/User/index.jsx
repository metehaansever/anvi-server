import styles from './User.module.css';
import UserHeader from './UserHeader';
import UserSubmits from './UserSubmits';

export const User = ({ user }) => {
  return (
    <div className={styles.root}>
      <UserHeader user={user} />
      <UserSubmits user={user} />
    </div>
  );
};
