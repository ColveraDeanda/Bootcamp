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
    public static Station_Discount__c stationDiscountInsert(Station_Discount__c stationDiscount){
        try {
            insert stationDiscount;
            return stationDiscount;
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

    @AuraEnabled
    public static String getStationName(id stationId){
        try {
            return [SELECT Id, Name FROM Station__c WHERE id =: stationId].Name;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}
