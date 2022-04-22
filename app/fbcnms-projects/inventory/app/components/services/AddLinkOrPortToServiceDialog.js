/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {EquipmentPort, Link} from '../../common/Equipment';
import type {PowerSearchLinkFirstEquipmentResultsTable_equipment} from './__generated__/PowerSearchLinkFirstEquipmentResultsTable_equipment.graphql';

import AvailableLinksAndPortsTable from './AvailableLinksAndPortsTable';
import Button from '@symphony/design-system/components/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EquipmentComparisonViewQueryRenderer from '../comparison_view/EquipmentComparisonViewQueryRenderer';
import InventoryQueryRenderer from '../InventoryQueryRenderer';
import PortsConnectedStateDialog from '../equipment/PortsConnectedStateDialog';
import PowerSearchLinkFirstEquipmentResultsTable from './PowerSearchLinkFirstEquipmentResultsTable';
import React, {useState} from 'react';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import Text from '@symphony/design-system/components/Text';
import nullthrows from '@fbcnms/util/nullthrows';
import symphony from '@symphony/design-system/theme/symphony';
import {WizardContextProvider} from '@symphony/design-system/components/Wizard/WizardContext';
import {graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: '8px',
    marginRight: '8px',
  },
  content: {
    height: '100%',
    width: '100%',
  },
  portIdLabel: {
    marginRight: '8px',
    fontWeight: 500,
  },
  root: {
    minWidth: '80vh',
    paddingTop: '0px',
    paddingLeft: '32px',
    paddingRight: '32px',
  },
  searchResults: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.common.white,
    height: '100%',
  },
  title: {
    display: 'block',
  },
  subtitle: {
    display: 'block',
    color: symphony.palette.D500,
  },
  footer: {
    padding: '16px 24px',
    boxShadow: theme.shadows[1],
  },
  actionButton: {
    '&&': {
      marginLeft: '12px',
    },
  },
}));

type Props = $ReadOnly<{|
  service: $ReadOnly<{|id: string, name: string|}>,
  onClose: () => void,
  onAddLink: (link: Link) => Promise<void>,
  onAddPort: (port: EquipmentPort) => Promise<void>,
|}>;

const addLinkOrPortToServiceDialogQuery = graphql`
  query AddLinkOrPortToServiceDialogQuery(
    $filters: [LinkFilterInput!]!
    $portFilters: [PortFilterInput!]!
  ) {
    links: links(filterBy: $filters, first: 50) {
      edges {
        node {
          id
          ports {
            parentEquipment {
              id
              name
            }
            definition {
              id
              name
            }
          }
          ...AvailableLinksAndPortsTable_links
        }
      }
    }
    ports: equipmentPorts(first: 50, filterBy: $portFilters) {
      edges {
        node {
          id
          link {
            id
          }
          ...AvailableLinksAndPortsTable_ports
        }
      }
    }
  }
`;

const AddLinkOrPortToServiceDialog = (props: Props) => {
  const [activeEquipement, setActiveEquipement] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [activeLink, setActiveLink] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(true);
  const {onAddLink, onAddPort, service, onClose} = props;
  const enqueueSnackbar = useEnqueueSnackbar();
  const classes = useStyles();
  const handleElementSelected = equipment => {
    setActiveEquipement(equipment);
  };

  const showMessage = msg => {
    enqueueSnackbar(msg, {
      children: key => (
        <SnackbarItem id={key} message={msg} variant="success" />
      ),
    });
  };

  const handleLinkSelected = (link: Link) => {
    setActiveLink(link);
  };

  const getStepContent = () => {
    const EquipmentTable = (props: {
      equipment: PowerSearchLinkFirstEquipmentResultsTable_equipment,
    }) => {
      return (
        <div className={classes.searchResults}>
          <PowerSearchLinkFirstEquipmentResultsTable
            equipment={props.equipment}
            onEquipmentSelected={handleElementSelected}
            selectedEquipment={activeEquipement}
          />
        </div>
      );
    };
    switch (activeStep) {
      case 0:
        return (
          <div className={classes.searchResults}>
            <EquipmentComparisonViewQueryRenderer limit={50}>
              {
                // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
                // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                props => <EquipmentTable {...props} />
              }
            </EquipmentComparisonViewQueryRenderer>
          </div>
        );
      case 1:
        return (
          <InventoryQueryRenderer
            query={addLinkOrPortToServiceDialogQuery}
            variables={{
              filters: [
                {
                  filterType: 'SERVICE_INST',
                  operator: 'IS_NOT_ONE_OF',
                  idSet: [service.id],
                },
                {
                  filterType: 'EQUIPMENT_INST',
                  operator: 'IS_ONE_OF',
                  idSet: [nullthrows(activeEquipement).id],
                },
              ],
              portFilters: [
                {
                  filterType: 'SERVICE_INST',
                  operator: 'IS_NOT_ONE_OF',
                  idSet: [service.id],
                },
                {
                  filterType: 'PORT_INST_EQUIPMENT',
                  operator: 'IS_ONE_OF',
                  idSet: [nullthrows(activeEquipement).id],
                },
              ],
              refreshToggle: refreshToggle,
            }}
            render={props => {
              const {links, ports} = props;
              const standAlonePorts = ports.edges
                .map(edge => edge.node)
                .filter(port => !port.link);
              return (
                <AvailableLinksAndPortsTable
                  equipment={nullthrows(activeEquipement)}
                  links={links.edges.map(edge => edge.node)}
                  ports={standAlonePorts}
                  selectedLink={activeLink}
                  onLinkSelected={handleLinkSelected}
                />
              );
            }}
          />
        );
      case 2:
        return (
          <PortsConnectedStateDialog
            mode={'connect'}
            link={null}
            equipment={nullthrows(activeEquipement)}
            port={nullthrows(activeLink ? activeLink.ports[0] : null)}
            workOrderId={null}
            open={true}
            isSubFlow={true}
            onClose={(link?: Link) => {
              onLinkCreationFlowComplete(link);
            }}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const onLinkCreationFlowComplete = (link?: Link) => {
    if (link) {
      onAddLink(link).then(() => {
        setRefreshToggle(!refreshToggle);
        setActiveStep(activeStep - 1);
        setActiveLink(null);
        showMessage('Link successfully created and added to the service');
      });
    } else {
      handleBack();
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      <DialogTitle>
        <Text className={classes.title} variant="h6">
          Add link/port to {service.name}
        </Text>
        {activeStep == 0 && (
          <Text className={classes.subtitle} variant="subtitle2" color="light">
            Select the equipment associated with the link/port.
          </Text>
        )}
        {activeStep == 1 && (
          <Text className={classes.subtitle} variant="subtitle2" color="light">
            Select the link or port you want to add to this service.
          </Text>
        )}
      </DialogTitle>
      <DialogContent div className={classes.root}>
        <WizardContextProvider>
          <div className={classes.content}>{getStepContent()}</div>
        </WizardContextProvider>
      </DialogContent>
      <DialogActions className={classes.footer}>
        {activeStep == 1 && (
          <Button skin="gray" onClick={onClose}>
            Done
          </Button>
        )}
        {activeStep == 1 && (
          <Button skin="gray" onClick={handleBack}>
            Back to Equipments
          </Button>
        )}
        {activeStep == 0 && (
          <Button
            disabled={activeEquipement === null}
            onClick={handleNext}
            className={classes.actionButton}>
            Next
          </Button>
        )}
        {activeStep == 1 && activeLink && !!activeLink.ports[1] && (
          <Button
            disabled={activeLink === null}
            onClick={() => {
              onAddLink(nullthrows(activeLink)).then(() => {
                showMessage('Link successfully added to the service');
                setActiveLink(null);
                setRefreshToggle(!refreshToggle);
              });
            }}
            className={classes.actionButton}>
            Add Link
          </Button>
        )}
        {activeStep == 1 && activeLink && !activeLink.ports[1] && (
          <>
            <Button
              disabled={activeLink === null}
              onClick={handleNext}
              className={classes.actionButton}>
              Create Link
            </Button>
            <Button
              onClick={() => {
                onAddPort(nullthrows(activeLink.ports[0])).then(() => {
                  showMessage('Port successfully added to the service');
                  setRefreshToggle(!refreshToggle);
                  setActiveLink(null);
                });
              }}
              className={classes.actionButton}>
              Add Port
            </Button>
          </>
        )}
      </DialogActions>
    </>
  );
};

export default AddLinkOrPortToServiceDialog;
