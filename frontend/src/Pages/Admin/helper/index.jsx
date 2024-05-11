const token = localStorage.getItem('accessToken');
export const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};