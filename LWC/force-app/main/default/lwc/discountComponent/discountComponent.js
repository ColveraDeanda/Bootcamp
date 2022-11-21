import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getStations from '@salesforce/apex/discountController.getAllStations';

const RECORD_FIELDS_OPPTY = [
    'Opportunity.Account',
    'Opportunity.Name',
    'Opportunity.OwnerId'
];

const STATION_TABLE_COLUMNS = [
    {label: 'Station Number', fieldName: 'Station_Number__c'},
    {label: 'Station Name', fieldName: 'Name'},
    {label: 'State', fieldName: 'State__c'},
    {label: 'Zip Code', fieldName: 'Zip_Code__c'}
]

export default class DiscountComponent extends LightningElement {


    @api recordId;
    @track isModalOpen = false;
    opptyRecords = {'sobjectType': 'Opportunity'}; // Objeto de tipo Opportunity.
    stationData; // Station Records
    stationColumns = STATION_TABLE_COLUMNS;


    connectedCallback() {
        console.log(this.recordId);
    }

    @wire(getRecord, {recordId: '$recordId', fields: RECORD_FIELDS_OPPTY})
    getOpptyRecordFields({data, error}) {
        if(data) {
            this.opptyRecords.Name = data.fields.Name.value;
           // this.opptyRecords.Account = data.fields.Account.value;;
            this.opptyRecords.Account = data.fields.Account.value.__ref.split(':')[3];
            this.opptyRecords.OwnerId = data.fields.OwnerId.value;
            error = undefined;
        } else if(error) {
            console.log(error);
            data = undefined;
        }
    }

    @wire(getStations, {})
        wiredStations({data, error}) {
            if(data) {
                console.log('Station Data:', data);
                this.stationData = data;
                error = undefined
            } else if(error) {
                console.log(error);
                data = undefined;
            }
        }
    

    
    
    handleSelectedFleet() {
        // Retreiving all Station depending fleet selection.
        
    }

    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }

}