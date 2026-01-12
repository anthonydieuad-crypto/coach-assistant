import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 1. On récupère le token
  const token = localStorage.getItem('token');

  // 2. S'il existe, on l'injecte dans l'en-tête Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // 3. Sinon, on laisse passer la requête telle quelle
  return next(req);
};