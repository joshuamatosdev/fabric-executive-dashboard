import React from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Text,
  Button,
  mergeClasses,
} from '@fluentui/react-components';
import {
  ReOrderDotsVertical24Regular,
  Settings24Regular,
  Delete24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    height: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.overflow('hidden'),
    '@media (min-width: 768px)': {
      ...shorthands.borderRadius('8px'),
    },
  },
  selected: {
    ...shorthands.border('2px', 'solid', tokens.colorBrandStroke1),
    boxShadow: tokens.shadow8Brand,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.padding('8px', '10px', '4px', '10px'),
    flexShrink: 0,
    '@media (min-width: 768px)': {
      ...shorthands.padding('10px', '12px', '6px', '12px'),
    },
  },
  headerEditable: {
    cursor: 'move',
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
    ...shorthands.overflow('hidden'),
  },
  title: {
    display: 'block',
    fontWeight: tokens.fontWeightSemibold,
    fontSize: 'clamp(11px, 1.2vw, 14px)',
    lineHeight: 1.3,
    color: tokens.colorNeutralForeground1,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  subtitle: {
    display: 'block',
    fontSize: 'clamp(9px, 1vw, 11px)',
    lineHeight: 1.3,
    color: tokens.colorNeutralForeground3,
    marginTop: '1px',
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('2px'),
    marginLeft: '4px',
    flexShrink: 0,
  },
  actionButton: {
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '0.2s',
  },
  containerHover: {
    '&:hover $actionButton': {
      opacity: 1,
    },
  },
  content: {
    flex: 1,
    ...shorthands.padding('0', '8px', '8px', '8px'),
    ...shorthands.overflow('hidden'),
    minHeight: 0,
    '@media (min-width: 768px)': {
      ...shorthands.padding('0', '10px', '10px', '10px'),
    },
  },
  dragHandle: {
    cursor: 'grab',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '0.2s',
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
    '&:active': {
      cursor: 'grabbing',
    },
  },
  dragHandleVisible: {
    opacity: 1,
  },
});

interface WidgetContainerProps {
  title: string;
  subtitle?: string;
  isEditing?: boolean;
  isSelected?: boolean;
  onSettings?: () => void;
  onDelete?: () => void;
  maxHeight?: string;
  children: React.ReactNode;
}

export function WidgetContainer({
  title,
  subtitle,
  isEditing = false,
  isSelected = false,
  onSettings,
  onDelete,
  maxHeight,
  children,
}: WidgetContainerProps) {
  const styles = useStyles();

  const containerClass = mergeClasses(
    styles.container,
    isSelected && styles.selected
  );

  const containerStyle = maxHeight ? { maxHeight } : undefined;

  const headerClass = mergeClasses(
    styles.header,
    isEditing && 'drag-handle',
    isEditing && styles.headerEditable
  );

  const dragHandleClass = mergeClasses(
    styles.dragHandle,
    isEditing && styles.dragHandleVisible
  );

  return (
    <div className={containerClass} style={containerStyle}>
      <div className={headerClass}>
        {isEditing && (
          <div className={dragHandleClass}>
            <ReOrderDotsVertical24Regular />
          </div>
        )}
        <div className={styles.titleContainer}>
          <Text className={styles.title}>{title}</Text>
          {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
        </div>
        {isEditing && (
          <div className={styles.actions}>
            <Button
              appearance="subtle"
              icon={<Settings24Regular />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onSettings?.();
              }}
            />
            <Button
              appearance="subtle"
              icon={<Delete24Regular />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            />
          </div>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
