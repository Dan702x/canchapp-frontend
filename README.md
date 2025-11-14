# CERTIFY Frontend

React + Vite + Tailwind + React Router basado en mockups.

## Requisitos
- Node 20 LTS, npm 9+

## Variables de entorno
Crea `.env` con:
```
VITE_API=http://localhost:8080/api
```
> Con Vite, todas las variables expuestas deben empezar con `VITE_`.

## Instalación
```
npm ci   # o npm i
```

## Desarrollo
```
npm run dev
```

## Build y preview
```
npm run build
npm run preview
```

## Estructura
```
src/
  components/layout/AppLayout.jsx
  lib/api.js
  pages/
    auth/{Login,Forgot,Reset}.jsx
    {Dashboard,Users,Areas,Supervisors,Interns,Templates,Audit,HelpCenter}.jsx
    certificates/{CertificatesList,CertificateDetail,IssueWizard}.jsx
  App.jsx
  main.jsx
  index.css
```
