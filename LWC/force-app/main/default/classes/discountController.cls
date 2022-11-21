public with sharing class discountController {

    @AuraEnabled(cacheable=true)
    public static List<Station__c> getAllStations() {
        try {
            return [SELECT Id, Station_Number__c, Name, State__c, Zip_Code__c FROM Station__c ORDER BY State__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }

}
