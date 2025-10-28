import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { PlusIcon, MinusIcon, TrashIcon, XMarkIcon } from './Icons';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
    const { t } = useLanguage();
    const { addNotification } = useNotification();

    const handleCheckout = () => {
        if (cart.length > 0) {
            addNotification({ type: 'success', message: t.cart.orderPlaced });
            clearCart();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-slideInUp">
                <div className="p-4 border-b dark:border-dark-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-primary dark:text-dark-primary">{t.cart.title} ({totalItems})</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-dark-text-secondary dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 dark:text-dark-text-secondary text-center py-16">{t.cart.empty}</p>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-text-dark dark:text-dark-text">{item.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{item.price.toFixed(2)} JOD</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 dark:bg-dark-border"><MinusIcon className="w-4 h-4" /></button>
                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 dark:bg-dark-border"><PlusIcon className="w-4 h-4" /></button>
                                    </div>
                                    <button onClick={() => { removeFromCart(item.id); addNotification({type: 'info', message: t.cart.itemRemoved}); }} className="p-2 text-red-500 hover:text-red-700">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="p-4 border-t dark:border-dark-border space-y-4">
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>{t.cart.total}:</span>
                            <span className="text-primary dark:text-dark-primary">{totalPrice.toFixed(2)} JOD</span>
                        </div>
                        <button 
                            onClick={handleCheckout} 
                            className="w-full py-3 bg-primary dark:bg-dark-primary text-white dark:text-dark-background font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            {t.cart.checkout}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;