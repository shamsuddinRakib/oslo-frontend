export const SERVER_URL = 'https://api.oslobd.com/api';
export const IMAGE_URL = 'https://api.oslobd.com/storage';

export async function register(name:string,phone:string,email:string,password:string,password_confirmation:string) {
    const response = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, phone, email, password, password_confirmation })
    });
    return response.json();

}

export async function login(phone:string,password:string) {
    const response = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, password })
    });
    return response.json();
}

export async function fetchProducts() {
    const response = await fetch(`${SERVER_URL}/products`);
    return response.json();
}

export async function fetchProduct(id:string) {
    const response = await fetch(`${SERVER_URL}/products/${id}`);
    return response.json();
}

export async function createProduct(formData: FormData, token: string) {
    const response = await fetch(`${SERVER_URL}/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    return response.json();
}

export async function updateProduct(id:string, formData: FormData, token: string) {
    const response = await fetch(`${SERVER_URL}/products/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    return response.json();
}

export async function deleteProduct(id:string, token: string) {
    const response = await fetch(`${SERVER_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json(); 
}

export async function fetchCategories() {
    const response = await fetch(`${SERVER_URL}/categories`);
    return response.json();
}

export async function createCategory(formData:FormData, token: string) {
    const response = await fetch(`${SERVER_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ formData })
    });
    return response.json();
}

export async function updateCategory(id:string, formData: FormData, token: string) {
    const response = await fetch(`${SERVER_URL}/categories/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ formData })
    });
    return response.json();
}

export async function fetchCategory(id:string) {
    const response = await fetch(`${SERVER_URL}/categories/${id}`);
    return response.json();
}

export async function deleteCategory(id:string, token: string) {
    const response = await fetch(`${SERVER_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json(); 
}

