pragma solidity ^0.4.24;

contract wineSecure {
    /* Define variable owner of the type address*/
    address public owner;

    /* Define variables that store Wine details */
    WineDetails public wineDetail;
    ChemicalAnalysis chemicalAnalysis;
    GeographicalIndication geographicalIndication;
    QualityTerm qualityTerm;   //fortified/specialised wine only

    /* Define a public event */
    event TransferOwnership(address owner, string message);
    event DetailsSet(string message);
    event Consumed(string message);

    /* Collection of shareHolders */
    SupplyChain[] public supplyChain;

    /* data structure to hold information on supply chain */
    struct SupplyChain {
        address source;
    }

    /* data structure to hold information on wine */
    struct WineDetails {
        string name;
        string vineyard;
        string grapeVariety;
        string colour;
        uint alcoholLevel;
        string status;
    }

    struct ChemicalAnalysis {
        string acidLevel;
        string phenolicContent;
        uint sugarLevel;
        string minerals;
        uint co2;
    }

    struct GeographicalIndication {
        string state;
        string region;
        string subregion;
    } 
    // ref https://www.wineaustralia.com/labelling/register-of-protected-gis-and-other-terms
    enum QualityTerm { Cream, Crusted, Ruby, Solera, Tawny, Vintage, Icewine, MethodeChampenoise, Moscato }

    /* Function to delete all information on the contract */
    function kill() public { 
        if (msg.sender == owner) 
            selfdestruct(owner); 
    }

    /* this runs when the contract is created  */
    constructor (
        string name,
        string vineyard,
        string grapeVariety,
        string colour,
        uint alcoholLevel
    ) public {
        // set the owner to be the creator of the contract
        owner = msg.sender;
        wineDetail.name = name;
        wineDetail.vineyard = vineyard;
        wineDetail.grapeVariety = grapeVariety;
        wineDetail.colour = colour;
        wineDetail.alcoholLevel = alcoholLevel;
        wineDetail.status = "registered";
        // init the record and supply chain records 
        supplyChain.push(SupplyChain({source : owner}));
        emit DetailsSet("Created.");
    }

    function consumed() public {         
        if (msg.sender != owner) return;
        wineDetail.status = "Consumed";
        emit DetailsSet("Wine has been consumed.");
    }

    function setDetails ( 
        string name,
        string vineyard,
        string grapeVariety,
        string colour,
        uint alcoholLevel) public  {
        // only the current owner can set the values
        if (msg.sender != owner) return; 
        // send an event 
        wineDetail.name = name;
        wineDetail.vineyard = vineyard;
        wineDetail.grapeVariety = grapeVariety;
        wineDetail.colour = colour;
        wineDetail.alcoholLevel = alcoholLevel;
        emit DetailsSet("Details updated");
    }

    function transferOwnership(address newOwner) public {
        // only the current owner can set the values
        if (msg.sender != owner) return; 
        supplyChain.push(SupplyChain({source : newOwner}));
        owner = newOwner;
        // send an event 
        emit TransferOwnership(msg.sender, "Wine ownership has been transfered");
    }

    // *******************************
    // The function without name will prevent any
    // Eth being stored against the contract
    // *******************************
    function () public payable {
    }
}