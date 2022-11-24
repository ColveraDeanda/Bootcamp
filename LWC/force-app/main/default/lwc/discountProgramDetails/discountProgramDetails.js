import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getDiscountPrograms from '@salesforce/apex/discountProgramDetailsController.getDiscountProgramAndStationsByOpp';

const RECORD_FIELDS_OPPTY = [
    'Opportunity.StageName'
];

export default class DiscountProgramDetails extends LightningElement {

    @api recordId;
    @track showDiscountDetails = false;

    @track gridColumns = [
        { label: 'Discount Program', fieldName: 'Name' },
        { label: 'Station Name', fieldName: 'Station__c' }
    ];

    @track gridData;

    connectedCallback() {
        getDiscountPrograms({ OpportunityId: this.recordId })
            .then(res => {
                const temp = JSON.parse(JSON.stringify(res));
                for (let i = 0; i < temp.length; i++) {
                    var relatedStations = temp[i]['Station_Discounts__r'];
                    if (relatedStations) {
                        temp[i]._children = relatedStations;
                        delete temp[i]['Station_Discounts__r'];
                    }
                }


                for (let i = 0; i < temp.length; i++) {
                    for (let j = 0; j < temp[i]._children.length; j++) {
                        let stationName = temp[i]._children[j]['Station__r'].Name;
                        temp[i]._children[j]['Station__c'] = stationName;
                    }

                }

                this.gridData = temp;

            })
            .catch(err => {
                console.log(err);
            });
    }


    @wire(getRecord, { recordId: '$recordId', fields: RECORD_FIELDS_OPPTY })
    getOpptyRecordFields({ data, error }) {
        if (data) {
            if (data.fields.StageName.value == "Closed Won") {
                this.showDiscountDetails = true;
            } else {
                this.showDiscountDetails = false;
            }
            error = undefined;
        } else if (error) {
            data = undefined;
        }
    }



}