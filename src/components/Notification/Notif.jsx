import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Notif = ({ message,type }) => {
    return (
        <div>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white font-medium`}
                >
                    <div className="flex items-center gap-2">
                        {type === 'success' ? (
                            <FiCheckCircle size={20} />
                        ) : (
                            <FiAlertCircle size={20} />
                        )}
                        <span>{message}</span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default Notif;