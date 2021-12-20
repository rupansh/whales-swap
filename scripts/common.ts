import hre from "hardhat";

export async function deploy<T>(contract_name: string, ...args: T[]) {
	const Contract = await hre.ethers.getContractFactory(contract_name);
	console.log(`Deploying ${contract_name}..`);
	const contract = await Contract.deploy(...args);
	await contract.deployed();
	console.log(`${contract_name} deployed to: ${contract.address}`);
	return contract;
}