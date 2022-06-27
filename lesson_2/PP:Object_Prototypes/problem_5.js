let profile = {name: 'Zack', age: 23,};
let largerProfile = Object.create(profile);
largerProfile.weight = 170;
largerProfile.race = 'Black';

for (let property in largerProfile) {
  console.log(`${property}: ${largerProfile[property]}`);
}
console.log();
Object.keys(largerProfile).forEach(property => {
  console.log(`${property}: ${largerProfile[property]}`);
});