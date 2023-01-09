import { ButtonLink } from '@/components/Button';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import Link from 'next/link';
import styles from './Hero.module.css';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Footer from '../../components/Layout/Footer';

const Hero = () => {
  function IconState(props) {
    const themeState = props;
    if (themeState.themeState.theme == 'light') {
      return (
        <Image
          src="/images/anvio.png"
          alt="anvio light"
          width={400}
          height={400}
        />
      );
    }
    return (
      <Image
        src="/images/anvi-dark.png"
        alt="anvio dark"
        width={400}
        height={400}
      />
    );
  }
  return (
    <Wrapper>
      <div>
        <div className={styles.anvihero}>
          <h1 className={styles.title}>
            <span className={styles.anvi}>Anvi</span>
            <span className={styles.server}>Server</span>
          </h1>
          <IconState themeState={useTheme('y')} />
        </div>
        <Container justifyContent="center" className={styles.buttons}>
          <Container>
            <Link passHref href="/feed">
              <ButtonLink className={styles.button}>Explore Feed</ButtonLink>
            </Link>
          </Container>
          <Spacer axis="horizontal" size={1} />
          <Container>
            <Link passHref href="/submit">
              <ButtonLink type="secondary" className={styles.button}>
                Submit
              </ButtonLink>
            </Link>
          </Container>
        </Container>
        <p className={styles.subtitle}>
          An open-source, community-driven analysis and visualization platform
          for microbial &apos;omics.
        </p>
      </div>
      <Footer />
    </Wrapper>
  );
};

export default Hero;
