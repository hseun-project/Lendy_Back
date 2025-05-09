import rateLimit from 'express-rate-limit';

export const limit = rateLimit({
  windowMs: 1000 * 60 * 10,
  max: 5,
  message: { message: '너무 많은 요청, 나중에 다시 시도하세요' }
});
