public with sharing class discountProgramDetailsController {
    
    // Tree Grid Query
    @AuraEnabled(cacheable=true)
    public static List<Discount_Program__c> getDiscountProgramAndStationsByOpp(id OpportunityId){
        try {
            return [Select id, Name, (Select id, Station__r.Name FROM Station_Discounts__r) From Discount_Program__c Where Opportunity__r.id =: OpportunityId];
            // Select id, Name, (Select id, Name FROM Station_Discounts__r) From Discount_Program__c Where Opportunity__r.id in ('0068W00000YW0lBQAT')
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }    

}
