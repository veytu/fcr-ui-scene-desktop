import { setTailwindConfig } from '@ui-kit-utils/tailwindcss';
import tailwindConfig from '../tailwind.config';
import { TailwindConfig } from 'tailwindcss/tailwind-config';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

setTailwindConfig(tailwindConfig as unknown as TailwindConfig);

dayjs.extend(duration);
