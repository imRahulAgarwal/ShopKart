import { apiUrl, toastOptions } from "../conf/conf";
import { toast } from "react-toastify";

export class AuthenticationService {
    async register(name, email, number, password) {
        const result = await fetch(`${apiUrl}/api/user/auth/register`, {
            method: "POST",
            body: JSON.stringify({ name, email, number, password }),
            headers: { "Content-Type": "application/json" },
        });
        const { success, message } = await result.json();
        if (success) return this.login(email, password);
        else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async login(email, password) {
        const cart = JSON.parse(localStorage.getItem("cart"));
        const body = { email, password };
        if (cart) body.cart = cart;

        const result = await fetch(`${apiUrl}/api/user/auth/login`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });
        const { success, message, user, token } = await result.json();
        if (success) {
            localStorage.setItem("token", token);
            toast.success(message, toastOptions);
            return user;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async profile() {
        const token = localStorage.getItem("token");
        const result = await fetch(`${apiUrl}/api/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const { success, user } = await result.json();
        if (success) return user;
        else return false;
    }

    async updateProfile(updateData) {
        const token = localStorage.getItem("token");
        const result = await fetch(`${apiUrl}/api/user/profile`, {
            method: "PATCH",
            body: JSON.stringify(updateData),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const { success, message } = await result.json();
        if (success) {
            toast.success(message, toastOptions);
            return true;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async showAddresses() {
        const token = localStorage.getItem("token");
        const result = await fetch(`${apiUrl}/api/user/addresses`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const { success, message, addresses } = await result.json();
        if (success) return addresses;
        else return false;
    }

    async showAddress(addressId) {
        const token = localStorage.getItem("token");
        const result = await fetch(
            `${apiUrl}/api/user/addresses/${addressId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const { success, message, address } = await result.json();
        if (success) return address;
        else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async createAddress(addressData) {
        const token = localStorage.getItem("token");
        const result = await fetch(`${apiUrl}/api/user/addresses`, {
            method: "POST",
            body: JSON.stringify(addressData),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const { success, message, address } = await result.json();
        if (success) {
            toast.success(message, toastOptions);
            return address;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async updateAddress(addressId, addressData) {
        const token = localStorage.getItem("token");
        const result = await fetch(
            `${apiUrl}/api/user/addresses/${addressId}`,
            {
                method: "PUT",
                body: JSON.stringify(addressData),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const { success, message } = await result.json();
        if (success) {
            toast.success(message, toastOptions);
            return true;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async deleteAddress(addressId, addressData) {
        const token = localStorage.getItem("token");
        const result = await fetch(
            `${apiUrl}/api/user/addresses/${addressId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const { success, message } = await result.json();
        if (success) {
            toast.success(message, toastOptions);
            return true;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async changeDefaultAddress(addressId) {
        const token = localStorage.getItem("token");
        const result = await fetch(
            `${apiUrl}/api/user/addresses/${addressId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const { success, message } = await result.json();
        if (success) {
            toast.success(message, toastOptions);
            return true;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async showCartItems() {
        const token = localStorage.getItem("token");
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        if (token) options.headers.Authorization = `Bearer ${token}`;

        if (!token) {
            const cart = JSON.parse(localStorage.getItem("cart"));
            if (cart) options.body = JSON.stringify(cart);
        }

        const result = await fetch(`${apiUrl}/api/cart/data`, options);
        const {
            success,
            cartDetails,
            cartTotalAmount,
            warning,
            validCartItems,
        } = await result.json();
        if (warning) toast.warn(warning, toastOptions);
        if (!token) {
            if (validCartItems && validCartItems.length)
                localStorage.setItem("cart", JSON.stringify(validCartItems));
            else localStorage.setItem("cart", JSON.stringify([]));
        }
        return { cartDetails, cartTotalAmount };
    }

    async updateCart(productId, color, quantity, authStatus) {
        let successResult = false;
        let resultMessage = "";
        if (authStatus) {
            const token = localStorage.getItem("token");
            const result = await fetch(`${apiUrl}/api/user/cart`, {
                method: "PATCH",
                body: JSON.stringify({ productId, color, quantity }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const { success, message } = await result.json();
            successResult = success;
            resultMessage = message;
        } else {
            let cart = JSON.parse(localStorage.getItem("cart"));
            if (cart && cart.length) {
                const index = cart.findIndex(
                    (cartItem) =>
                        cartItem.productId === productId &&
                        cartItem.color === color
                );
                if (index === -1) {
                    cart.push({ productId, color, quantity });
                } else {
                    cart[index].quantity += quantity;
                    if (cart[index].quantity <= 0) {
                        cart.splice(index, 1);
                    }
                }
            } else {
                cart = [{ productId, color, quantity }];
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            successResult = true;
            resultMessage = "Cart updated successfully.";
        }
        if (successResult) {
            toast.success(resultMessage, toastOptions);
            return true;
        } else {
            toast.error(resultMessage, toastOptions);
            return false;
        }
    }

    async createOrder(addressId, variantId, color, quantity) {
        const body = { addressId };

        if (variantId && color && quantity) {
            body.color = color;
            body.variantId = variantId;
            body.quantity = quantity;
        }

        const token = localStorage.getItem("token");
        const result = await fetch(`${apiUrl}/api/orders`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const { success, message, phonePeResponse } = await result.json();
        if (!success) toast.warn(message, toastOptions);
        return { phonePeResponse };
    }

    async showOrders(page) {
        const token = localStorage.getItem("token");
        const result = await fetch(`${apiUrl}/api/orders?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const { success, message, orders, totalPages } = await result.json();
        if (success) return { orders, totalPages };
        else return false;
    }

    // This function will be called by OrderDetails.jsx
    async showOrder(orderId) {
        const token = localStorage.getItem("token");
        const result = await fetch(`${apiUrl}/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const { success, message, order } = await result.json();
        if (success) return order;
        else return false;
    }

    // This function will be called by OrderStatus.jsx
    async getOrderStatus(transactionId) {
        if (transactionId) {
            const token = localStorage.getItem("token");
            const result = await fetch(
                `${apiUrl}/api/orders/status/${transactionId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const { success, message, order } = await result.json();
            return order;
        }
    }

    async changePassword(oldPassword, newPassword, confirmPassword) {
        const token = localStorage.getItem("token");
        const result = await fetch(`${apiUrl}/api/user/password/change`, {
            method: "PATCH",
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const { success, message } = await result.json();
        if (success) {
            toast.success(message, toastOptions);
            return true;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async forgotPassword(email) {
        const result = await fetch(`${apiUrl}/api/user/password/forgot`, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
        });
        const { success, message } = await result.json();
        if (success) {
            toast.success(message, toastOptions);
            return true;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }

    async resetPassword(token, newPassword, confirmPassword) {
        const result = await fetch(`${apiUrl}/api/user/password/reset`, {
            method: "POST",
            body: JSON.stringify({ token, newPassword, confirmPassword }),
            headers: { "Content-Type": "application/json" },
        });
        const { success, message } = await result.json();
        if (success) {
            toast.success(message, toastOptions);
            return true;
        } else {
            toast.error(message, toastOptions);
            return false;
        }
    }
}

export const authService = new AuthenticationService();
