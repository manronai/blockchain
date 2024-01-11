// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './LibString.sol';

contract userDB {

    struct userInfo{
        
        string email;
        string password;
        string addr;
        string privateKey;
        string fileHash;
        string authenticFileHash;
        uint is_admin;
    }
    
    struct schoolInfo{
        string schoolName;
        string password;
        string addr;
        string privateKey;
        mapping(string => string) names;
        uint is_admin ;
        string applied_for_cert;
        
    }
   
    
    mapping(string => schoolInfo) public schoolMembership;
    mapping(string => userInfo) public membership;



    function push_to_applied(string memory school_name, string memory student_name, string memory password) public{
        //check if student name and password available in that school's 'names' map variable
        require(compare(schoolMembership[school_name].names[student_name], password), "Password does not match against your name in that school");
        if(compare(schoolMembership[school_name].names[student_name], password)){
        schoolMembership[school_name].applied_for_cert = string.concat(schoolMembership[school_name].applied_for_cert, " ");
        
        schoolMembership[school_name].applied_for_cert = string.concat(schoolMembership[school_name].applied_for_cert, student_name);
        }
    }

    function push_names(string memory stu_name, string memory school_name, string memory pwrd) public{
      // require(bytes(schoolMembership[school_name].schoolName).length == 0, "account already exits with this email!");
        if(bytes(schoolMembership[school_name].schoolName).length != 0){
        
        schoolMembership[school_name].names[stu_name] =pwrd;
        
        }
    }

    function compare(string memory str1, string memory str2) public pure returns (bool) {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function check_name(string memory schl_name, string memory stu_name, string memory pwrd) public view returns(bool){
        if (compare(schoolMembership[schl_name].names[stu_name], pwrd)){
            return true;
        }
        return false;
    }



    //mapping (uint256 => mapping(string => bytes32)) public id_vs_hash;

    function saveSchool(
    
    string memory school_name, 
    string memory password,
    string memory addr,
    string memory privateKey
     ) external {
        require(bytes(schoolMembership[school_name].schoolName).length == 0, "account already exits with this email!");
        if(bytes(schoolMembership[school_name].schoolName).length == 0){
        
        schoolMembership[school_name].schoolName = school_name;
        schoolMembership[school_name].password = password;
        schoolMembership[school_name].addr = addr;
        schoolMembership[school_name].privateKey = privateKey;
        schoolMembership[school_name].is_admin = 2;
        }

    }

    function saveUser(
    
    string memory user_email, 
    string memory password,
    string memory addr,
    string memory privateKey) external {
        require(bytes(membership[user_email].email).length == 0, "account already exits with this email!");
        if(bytes(membership[user_email].email).length == 0){
        
        membership[user_email].email = user_email;
        membership[user_email].password = password;
        membership[user_email].addr = addr;
        membership[user_email].privateKey = privateKey;
        membership[user_email].is_admin = 0;
        }

    }



    function putFileHash(string memory user_email, string memory privateKey, string memory fileHash) public {
        if( bytes(membership[user_email].email).length != 0){
            if(compare(membership[user_email].privateKey ,privateKey)){
                membership[user_email].fileHash = fileHash;
            }
        }
    }
    function return_value_from_index(string memory school_name) public view returns(string memory){
        return schoolMembership[school_name].applied_for_cert;
    }

    function replace_from_applied_for_cert(string memory school_name, string memory student_name) public {
        schoolMembership[school_name].applied_for_cert = replace(schoolMembership[school_name].applied_for_cert, student_name, "");
    }

    
    function replace(
        string memory subject,
        string memory search, 
        string memory replacement
    ) public pure returns (string memory result) 
    {
        result = LibString.replace(subject, search, replacement);
    }
// below redundant functions for now!
    function updateUser(string memory user_email, uint256 option, string memory data) external {
        if (option == 0) {
            membership[user_email].email = data;
        }
        else if (option == 1) {
            membership[user_email].password = data;
        }
    }
    function removeUser( string memory user_email) external {
            delete membership[user_email];
    }
    function getUser(string memory email)public view returns (userInfo memory){

        return membership[email];
    }
}

/////////////////////////////////////////////////////////////////////////////////



// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


library LibString {
    function replace(
        string memory subject,
        string memory search, 
        string memory replacement
    ) internal pure returns (string memory result) {
        assembly {
            let subjectLength := mload(subject)
            let searchLength := mload(search)
            let replacementLength := mload(replacement)

            // Store the mask for sub-word comparisons in the scratch space.
            mstore(0x00, not(0))
            mstore(0x20, 0)

            subject := add(subject, 0x20)
            search := add(search, 0x20)
            replacement := add(replacement, 0x20)
            result := add(mload(0x40), 0x20)

            let k := 0

            let subjectEnd := add(subject, subjectLength)
            if iszero(gt(searchLength, subjectLength)) {
                let subjectSearchEnd := add(sub(subjectEnd, searchLength), 1)
                for {} lt(subject, subjectSearchEnd) {} {
                    let o := and(searchLength, 31)
                    // Whether the first `searchLength % 32` bytes of 
                    // `subject` and `search` matches.
                    let l := iszero(and(xor(mload(subject), mload(search)), mload(sub(0x20, o))))
                    // Iterate through the rest of `search` and check if any word mismatch.
                    // If any mismatch is detected, `l` is set to 0.
                    for {} and(lt(o, searchLength), l) {} {
                        l := eq(mload(add(subject, o)), mload(add(search, o)))
                        o := add(o, 0x20)
                    }
                    // If `l` is one, there is a match, and we have to copy the `replacement`.
                    if l {
                        // Copy the `replacement` one word at a time.
                        for { o := 0 } lt(o, replacementLength) { o := add(o, 0x20) } {
                            mstore(add(result, add(k, o)), mload(add(replacement, o)))
                        }
                        k := add(k, replacementLength)
                        subject := add(subject, searchLength)
                    }
                    // If `l` or `searchLength` is zero.
                    if iszero(mul(l, searchLength)) {
                        mstore(add(result, k), mload(subject))
                        k := add(k, 1)
                        subject := add(subject, 1)
                    }
                }
            }

            let resultRemainder := add(result, k)
            k := add(k, sub(subjectEnd, subject))
            // Copy the rest of the string one word at a time.
            for {} lt(subject, subjectEnd) {} {    
                mstore(resultRemainder, mload(subject))
                resultRemainder := add(resultRemainder, 0x20)
                subject := add(subject, 0x20)
            }
            // Allocate memory for the length and the bytes, rounded up to a multiple of 32.
            mstore(0x40, add(result, and(add(k, 64), not(31))))
            result := sub(result, 0x20)
            mstore(result, k)
        }
    }
}