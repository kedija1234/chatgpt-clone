import { Bot } from 'lucide-react';
import ChatMessage from '../ChatMessage/ChatMessage';
import styles from './MessageList.module.css';

export default function MessageList({
  conversations,
  isLoading,
  messagesEndRef,
}) {
  return (
    <div className={styles.messages}>
      {conversations.length === 0 ? (
        <div className={styles.empty}>What are you working on?</div>
      ) : (
        conversations.map(msg => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingAvatar}>
            <Bot size={18} color='white' />
          </div>
          <div className={styles.loading}>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
