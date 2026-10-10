import {
  MessageSquare,
  Search,
  Image as ImageIcon,
  LayoutGrid,
  Microscope,
  Code2,
  FolderKanban,
  PanelLeftClose,
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.iconBtn}>
            <PanelLeftClose size={20} />
          </div>
        </div>
        <button className={styles.iconBtn}>
          <MessageSquare size={20} />
        </button>
      </div>

      <nav className={styles.nav}>
        <a href='#' className={styles.item}>
          <MessageSquare size={18} />
          <span>New chat</span>
        </a>
        <a href='#' className={styles.item}>
          <Search size={18} />
          <span>Search chats</span>
        </a>
        <a href='#' className={styles.item}>
          <ImageIcon size={18} />
          <span>Images</span>
        </a>
        <a href='#' className={styles.item}>
          <LayoutGrid size={18} />
          <span>Apps</span>
        </a>
        <a href='#' className={styles.item}>
          <Microscope size={18} />
          <span>Deep research</span>
        </a>
        <a href='#' className={styles.item}>
          <Code2 size={18} />
          <span>Codex</span>
        </a>
        <a href='#' className={styles.item}>
          <FolderKanban size={18} />
          <span>Projects</span>
        </a>
      </nav>
    </aside>
  );
}
