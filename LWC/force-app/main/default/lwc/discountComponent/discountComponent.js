import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getStations from '@salesforce/apex/discountController.getAllStations';
import getAccountFleet from '@salesforce/apex/discountController.getAccountFleet';
import stationDiscountInsert from '@salesforce/apex/discountController.stationDiscountInsert';
import getStationName from '@salesforce/apex/discountController.getStationName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const RECORD_FIELDS_OPPTY = [
    'Opportunity.Name',
    'Opportunity.OwnerId',
    'Opportunity.StageName'
];

const RECORD_FIELDS_STATION = [
    'Station__c.Name'
];

const RECORD_FIELDS_FLEET = [
    'Fleet__c.State__c',
    'Fleet__c.National_Fleet__c'
]

const STATION_TABLE_COLUMNS = [
    { label: 'Station Number', fieldName: 'Station_Number__c' },
    { label: 'Station Name', fieldName: 'Name' },
    { label: 'State', fieldName: 'State__c' },
    { label: 'Zip Code', fieldName: 'Zip_Code__c' }
]

export default class DiscountComponent extends LightningElement {

    /**
     * Usar siempre que sea posible getRecord, se podrá usar sin problema siempre y cuando se cuente con el ID del objeto
     * En caso de no contar con el ID en nigún lado, solo así hacer la llamada Apex.
     */


    @api recordId; // Opportunity
    @track isModalOpen = false;
    opptyRecords = { 'sobjectType': 'Opportunity' }; // Objeto de tipo Opportunity.
    stationData; // Station Records
    stationColumns = STATION_TABLE_COLUMNS;
    selectedFleetId;
    tempStations;
    @track accountFleet; // Account related to Fleet.
    stationsSelected = [];
    isCloseWon = false;
    stationsIds = [];
    stationNames = [];


    @wire(getRecord, { recordId: '$recordId', fields: RECORD_FIELDS_OPPTY })
    getOpptyRecordFields({ data, error }) {
        if (data) {
            this.opptyRecords.Name = data.fields.Name.value;
            this.opptyRecords.OwnerId = data.fields.OwnerId.value;
            this.opptyRecords.Stage = data.fields.StageName.value;
            if (this.opptyRecords.Stage == "Closed Won") {
                this.isCloseWon = true;
            } else {
                this.isCloseWon = false;
            }
            error = undefined;
        } else if (error) {
            data = undefined;
        }
    }


    @wire(getStations, {})
    wiredStations({ data, error }) {
        if (data) {
            this.tempStations = data;
            error = undefined
        } else if (error) {
            data = undefined;
        }
    }



    @wire(getRecord, { recordId: '$selectedFleetId', fields: RECORD_FIELDS_FLEET })
    wiredFleet({ data, error }) {
        if (data) {
            if (data.fields.National_Fleet__c.value) {
                this.stationData = this.tempStations;
            } else {
                const state = data.fields.State__c.value;
                let stations = this.tempStations;
                let lstStations = [];

                stations.forEach(element => {
                    if (element.State__c === state) {
                        lstStations.push(element);
                    }
                });
                this.stationData = lstStations;
            }

            error = undefined
        } else if (error) {
            data = undefined;
        }
    }




    handleSelectedFleet(event) {
        this.selectedFleetId = event.detail.value[0];
        if (this.selectedFleetId) {
            getAccountFleet({ fleetId: this.selectedFleetId })
                .then(res => {
                    this.accountFleet = res[0].Account__c;
                })
                .catch(error => {
                })
        } else {
            this.stationData = undefined;
        }

    }

    handleSuccess(event) {
        let stationsSelectedArr = this.stationsSelected.split(',');
        stationsSelectedArr.forEach(stationId => {
            var stationDiscountObj = {
                'Opportunity__c': this.recordId,
                'Station__c': stationId,
                'Discount_Program__c': event.detail.id
            }
            this.stationsIds.push(stationId);
            stationDiscountInsert({ stationDiscount: stationDiscountObj })
                .then(res => {
                })
                .catch(err => {
                });
        })

        this.stationsIds.forEach(station => {
            getStationName({ stationId: station })
                .then(res => {
                    this.stationNames.push(res);
                })
                .catch(err => {
                })

        })

        setTimeout(() => {
            let stationNameString = this.stationNames.join(',');
            let stationsFormat = stationNameString.slice(0, stationNameString.length - 1);
            this.stationsIds = [];
            this.stationNames = [];

            // Info Message
            this.dispatchEvent(new ShowToastEvent({
                title: 'Station Details',
                message: `Stations ${stationsFormat} added successfully to New Discount Program`,
                variant: 'info',
                mode: 'sticky'
            }));
        }, 500);



        // Success Message
        let stationMsj = '';
        stationsSelectedArr.length == 1 ? stationMsj = 'station' : stationMsj = 'stations';
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: `New discount program has been created successfully with ${stationsSelectedArr.length} ${stationMsj} related to it.`,
            variant: 'success'
        }));
        this.closeModal();



    }

    getSelectedRec() {
        var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        if (selectedRecords.length > 0) {
            let ids = '';
            selectedRecords.forEach(currentItem => {
                ids = ids + ',' + currentItem.Id;
            });
            this.selectedIds = ids.replace(/^,/, '');
            this.lstSelectedRecords = selectedRecords;
            this.stationsSelected = this.selectedIds;
        }
    }

    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
        this.accountFleet = undefined;
    }

    consoleArrProxy(arr) {
        arr.forEach(elem => {
            console.log(elem);
        })
    }

}