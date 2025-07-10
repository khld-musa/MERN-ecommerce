import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'

import { useSelector } from 'react-redux'
import { createBankPaymentOrder } from '../../actions/orderActions'
import { clearCart } from '../../actions/cartActions'

const ConfirmOrder = ({ history }) => {

    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [bankImage, setBankImage] = useState(null);
    const [bankImagePreview, setBankImagePreview] = useState(null);
    const [showBankModal, setShowBankModal] = useState(false);

    const handleProceedClick = () => {
        setShowPaymentOptions(true);
    };

    const handlePaymentSelect = (e) => {
        setSelectedPayment(e.target.value);
        if (e.target.value === 'bank') {
            setShowBankModal(true);
        }
    };

    const handleBankImageChange = (e) => {
        const file = e.target.files[0];
        setBankImage(file);
        setBankImagePreview(URL.createObjectURL(file));
    };

    const closeBankModal = () => {
        setShowBankModal(false);
        setSelectedPayment('');
    };

    const handleBankSubmit = async (e) => {
        e.preventDefault();
        if (!bankImage) {
            alert('Please upload a bank statement image.');
            return;
        }
        const order = {
            orderItems: cartItems,
            shippingInfo,
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice,
        };
        await dispatch(createBankPaymentOrder(order, bankImage));
        dispatch(clearCart()); // Reset cart after confirmation
        setShowBankModal(false);
        history.push('/success');
    };

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        history.push('/payment')
    }

    return (
        <Fragment>

            <MetaData title={'Confirm Order'} />

            <CheckoutSteps shipping confirmOrder />

            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">

                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:</b> {user && user.name}</p>
                    <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    {cartItems.map(item => (
                        <Fragment key={item.product}>
                            <hr />
                            <div className="cart-item my-1">
                                <div className="row">
                                    <div className="col-4 col-lg-2">
                                        <img src={item.image && item.image.startsWith('/uploads') ? item.image : item.image} alt={item.name} height="45" width="65" />
                                    </div>

                                    <div className="col-5 col-lg-6">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>


                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>{item.quantity} x ${item.price} = <b>${(item.quantity * item.price).toFixed(2)}</b></p>
                                    </div>

                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}



                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">${itemsPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />
                        <button id="checkout_btn" className="btn btn-primary btn-block" onClick={handleProceedClick}>Proceed to Payment</button>
                        {showPaymentOptions && (
                            <div className="mt-3">
                                <label htmlFor="payment_method">Choose Payment Method:</label>
                                <select id="payment_method" className="form-control my-2" value={selectedPayment} onChange={handlePaymentSelect}>
                                    <option value="">Select...</option>
                                    <option value="card">Card</option>
                                    <option value="bank">Local Bank</option>
                                </select>
                                {selectedPayment === 'card' && (
                                    <button className="btn btn-success btn-block mt-2" onClick={processToPayment}>Pay with Card</button>
                                )}
                            </div>
                        )}
                        {showBankModal && (
                            <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Local Bank Payment</h5>
                                            <button type="button" className="close" onClick={closeBankModal} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <strong>Fawry:</strong> 51200465<br />
                                                <strong>Bankak:</strong> 2347849
                                            </div>
                                            <form onSubmit={handleBankSubmit}>
                                                <div className="form-group">
                                                    <label>Upload Bank Statement</label>
                                                    <input type="file" accept="image/*" className="form-control" onChange={handleBankImageChange} required />
                                                    {bankImagePreview && <img src={bankImagePreview} alt="Bank Statement Preview" className="img-fluid mt-2" style={{ maxHeight: '150px' }} />}
                                                </div>
                                                <button className="btn btn-success btn-block mt-2" type="submit">Confirm Bank Payment</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


            </div>

        </Fragment>
    )
}

export default ConfirmOrder
