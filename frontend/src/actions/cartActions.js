import axios from 'axios'
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO, CLEAR_CART } from '../constants/cartConstants'

// Fetch user cart from backend
export const fetchUserCart = () => async (dispatch) => {
    const { data } = await axios.get('/api/v1/cart');
    dispatch({
        type: 'FETCH_CART',
        payload: data.cart
    });
    localStorage.setItem('cartItems', JSON.stringify(data.cart));
}

// Add or update cart item in backend
export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/product/${id}`)
    const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity
    };
    await axios.post('/api/v1/cart', item);
    dispatch({
        type: ADD_TO_CART,
        payload: item
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

// Remove item from backend cart
export const removeItemFromCart = (id) => async (dispatch, getState) => {
    await axios.delete(`/api/v1/cart/${id}`);
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

// Clear backend cart
export const clearCart = () => async (dispatch) => {
    await axios.delete('/api/v1/cart');
    dispatch({ type: CLEAR_CART });
    localStorage.setItem('cartItems', JSON.stringify([]));
}

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })
    localStorage.setItem('shippingInfo', JSON.stringify(data))
}