import { MenuList } from '@mui/material';
import { useState } from 'react';
import { MenuItem, SubMenuItem } from '../../../api/content/types/menu';
import { AccountMenuItem } from './AccountMenuItem';

interface AccountMenuListProps {
  accountItem?: MenuItem;
  onItemClick: (item: SubMenuItem) => void;
}

export const AccountMenuList: React.FC<AccountMenuListProps> = ({ accountItem, onItemClick }) => {
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  return (
    <MenuList sx={{ ml: 0.5, py: 0 }} data-testid="account-menu-list">
      {accountItem?.elements.subMenuItems?.values
        ?.map((item, idx) =>
          item ? (
            <AccountMenuItem
              key={item.elements.name.value}
              item={item}
              index={idx}
              isOpen={openItemIndex === idx}
              onToggle={() => handleToggleItem(idx)}
              onItemClick={onItemClick}
            />
          ) : null,
        )
        .filter(Boolean)}
    </MenuList>
  );

  function handleToggleItem(index: number) {
    setOpenItemIndex(prevIndex => (prevIndex === index ? null : index));
  }
};
