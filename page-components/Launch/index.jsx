import { Spacer } from '@/components/Layout';
import styles from './Launch.module.css';
import LaunchForm from './LaunchForm';

export const Launch = () => {
  return (
    <div className={styles.root}>
      <Spacer size={1} axis="vertical" />
      <LaunchForm />
    </div>
  );
};
