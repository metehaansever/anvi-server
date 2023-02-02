import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useSubmitPages() {
  return useSWR('/api/submissions', fetcher);
}
