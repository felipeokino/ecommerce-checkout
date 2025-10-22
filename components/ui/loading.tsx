import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type LoadingProps = {
  size: 'small' | 'medium' | 'large';
}
const Loading = ({ size }: LoadingProps) => {
  return (
    <Loader2 className={cn(`animate-spin w-4 h-4 `, {
      'w-3 h-3': size === 'small',
      'w-6 h-6': size === 'medium',
      'w-10 h-10': size === 'large',
    })} />
  )
}

export default Loading