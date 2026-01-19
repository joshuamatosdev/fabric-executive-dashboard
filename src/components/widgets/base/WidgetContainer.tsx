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
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.overflow('hidden'),
  },
  selected: {
    ...shorthands.border('2px', 'solid', tokens.colorBrandStroke1),
    boxShadow: tokens.shadow8Brand,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.padding('12px', '12px', '8px', '12px'),
  },
  headerEditable: {
    cursor: 'move',
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    display: 'block',
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  subtitle: {
    display: 'block',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    marginLeft: '8px',
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
    ...shorthands.padding('0', '12px', '12px', '12px'),
    ...shorthands.overflow('hidden'),
    minHeight: 0,
  },
  dragHandle: {
    cursor: 'grab',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '0.2s',
    color: tokens.colorNeutralForeground3,
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
  children: React.ReactNode;
}

export function WidgetContainer({
  title,
  subtitle,
  isEditing = false,
  isSelected = false,
  onSettings,
  onDelete,
  children,
}: WidgetContainerProps) {
  const styles = useStyles();

  const containerClass = mergeClasses(
    styles.container,
    isSelected && styles.selected
  );

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
    <div className={containerClass}>
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
