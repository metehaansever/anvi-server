import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import { Wrapper, Spacer } from '@/components/Layout';
import { fetcher } from '@/lib/fetch';
import { usePostPages } from '@/lib/post';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './LaunchForm.module.css';

const Launch = () => {
  const titleRef = useRef();
  const descRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const affiliationRef = useRef();
  const webRef = useRef();
  const workdirRef = useRef();
  const setupRef = useRef();
  const runRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = usePostPages();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await fetcher('/api/launch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: titleRef.current.value,
            desc: descRef.current.value,
            name: nameRef.current.value,
            email: emailRef.current.value,
            affiliation: affiliationRef.current.value,
            web: webRef.current.value,
            workdir: workdirRef.current.value,
            setup: setupRef.current.value,
            run: runRef.current.value,
          }),
        });
        toast.success('You have submit successfully');
        titleRef.current.value = '';
        descRef.current.value = '';
        nameRef.current.value = '';
        emailRef.current.value = '';
        affiliationRef.current.value = '';
        webRef.current.value = '';
        workdirRef.current.value = '';
        setupRef.current.value = '';
        runRef.current.value = '';
        // refresh launch lists
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.leftside}>
            <div className={styles.project}>
              <h2 className={styles.heading} title="Choose your project Title">
                Project
              </h2>
              <Input
                ref={titleRef}
                htmlType="text"
                autoComplete="title"
                placeholder="Title"
                ariaLabel="Title"
                size="large"
                required
              />
              <Spacer size={0.5} axis="vertical" />
              <Input
                ref={descRef}
                htmlType="text"
                autoComplete="desc"
                placeholder="Description"
                ariaLabel="Description"
                size="large"
                required
              />
              <Spacer size={0.5} axis="horizontal" />
            </div>
            <Spacer size={0.5} axis="vertical" />
            <div className={styles.project}>
              <h2 className={styles.heading}>Author</h2>
              <Input
                ref={nameRef}
                htmlType="text"
                autoComplete="name"
                placeholder="Full Name"
                ariaLabel="Full Name"
                size="large"
                required
              />
              <Spacer size={0.5} axis="vertical" />
              <Input
                ref={emailRef}
                htmlType="email"
                autoComplete="email"
                placeholder="Email Address"
                ariaLabel="Email Address"
                size="large"
              />
              <Spacer size={0.5} axis="vertical" />
              <Input
                ref={affiliationRef}
                htmlType="text"
                autoComplete="affiliation"
                placeholder="Affiliation"
                ariaLabel="Affiliation"
                size="large"
              />
              <Spacer size={0.5} axis="vertical" />
              <Input
                ref={webRef}
                htmlType="url"
                autoComplete="web"
                placeholder="Web Page"
                ariaLabel="Web Page"
                size="large"
              />
            </div>
          </div>
          <Spacer size={1} axis="horizontal" />
          <div className={styles.rightside}>
            <div className={styles.project}>
              <h2 className={styles.heading}>Working Directory</h2>
              <Input
                ref={workdirRef}
                htmlType="text"
                placeholder="Working Directory"
                ariaLabel="Working Directory"
                size="large"
                required
              />
            </div>
            <Spacer size={0.5} axis="vertical" />
            <div className={styles.project}>
              <h2 className={styles.heading}>Setup Commands</h2>
              <Textarea
                ref={setupRef}
                htmlType="text"
                placeholder="Setup Commands"
                ariaLabel="Setup Commands"
                size="large"
                required
              />
            </div>
            <Spacer size={0.5} axis="vertical" />
            <div className={styles.project}>
              <h2 className={styles.heading}>Anvio Commands</h2>
              <Textarea
                ref={runRef}
                htmlType="text"
                placeholder="Anvi'o Commands"
                ariaLabel="Anvi'o Commands"
                size="large"
                required
              />
            </div>
          </div>
        </form>
        <Spacer size={1.5} axis="vertical" />
        <div className={styles.btn}>
          <Button type="success" loading={isLoading} onSubmit={onSubmit}>
            {' '}
            Submit{' '}
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Launch;