import { apiUrl } from "../conf/conf";

class ProductService {
    async getProducts(page, search) {
        let url = `${apiUrl}/api/products?page=${page}`;

        if (search) url += `&search=${search}`;

        const response = await fetch(url);
        const result = await response.json();

        return result;
    }

    async getProduct(productId) {
        const response = await fetch(`${apiUrl}/api/products/${productId}`);
        const result = await response.json();

        return result;
    }
}

export const productService = new ProductService();
