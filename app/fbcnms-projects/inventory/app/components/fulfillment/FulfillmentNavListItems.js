/*[object Object]*/
// eslint-disable-next-line header/header
import NavListItem from '@fbcnms/ui/components/NavListItem';
import React from 'react';
import SummarizeIcon from '@material-ui/icons/Summarize';
import {LogEvents, ServerLogger} from '../../common/LoggingUtils';
import {useRelativeUrl} from '@fbcnms/ui/hooks/useRouter';

export const FulfillmentNavListItems = () => {
  const relativeUrl = useRelativeUrl();
  return [
    <NavListItem
      key={1}
      label="Services"
      path={relativeUrl('/fulfillmentCatalog/services')}
      icon={<SummarizeIcon />}
      onClick={() => {
        ServerLogger.info(LogEvents.PERFORMANCE_TAB_NAVIGATION_CLICKED);
      }}
    />,
  ];
};
