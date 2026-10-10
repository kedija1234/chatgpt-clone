import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './ChatMessage.module.css';

export default function ChatMessage({ role, content }) {
  return (
    <div className={`${styles.message} ${styles[role]}`}>
      <div className={`${styles.avatar} ${styles[role]}`}>
        {role === 'user' ? (
          <User size={18} color='white' />
        ) : (
          <Bot size={18} color='white' />
        )}
      </div>
      <div className={styles.content}>
        {role === 'user' ? (
          content
        ) : (
          <div className={styles.markdownBody}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
