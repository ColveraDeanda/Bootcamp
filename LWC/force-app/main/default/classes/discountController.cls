public with sharing class discountController {

    @AuraEnabled(cacheable=true)
    public static List<Station__c> getAllStations() {
        try {
            return [SELECT Id, Station_Number__c, Name, State__c, Zip_Code__c FROM Station__c ORDER BY State__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }

    @AuraEnabled
    public static List<Station__c> getStationsByState(String state){
        try {
            return [SELECT Id, Station_Number__c, Name, State__c, Zip_Code__c FROM Station__c WHERE State__c = :state ORDER BY State__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Fleet__c> getAccountFleet(Id fleetId){
        try {
            return [Select Id, Account__r.Id FROM Fleet__c WHERE Id = :fleetId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*
    @AuraEnabled(cacheable=true)
    public static List<JobApplication__c> getGeneralData(id hiredId) {
        Id jobApplicationId = [Select id, JobApplication__c from Hired__c where Id = :hiredId].JobApplication__c;
        List<JobApplication__c> candidateGeneralData = [SELECT Id, Name, Candidate__r.Names__c, Candidate__r.Surname__c, Candidate__r.Country__c, Candidate__r.City__c, Candidate__r.Requires_Visa__c FROM JobApplication__c Where Id = :jobApplicationId];
        return candidateGeneralData;
    }
    */

}
