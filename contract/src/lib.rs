use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct AddProjectParams {
    pub owner: AccountId,
    pub name: String,
    pub description: String,
    pub image: String,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Project {
    pub id: u64,
    pub owner: AccountId,
    pub name: String,
    pub description: String,
    pub image: String,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Nearboard {
    current_id: u64,
    projects: UnorderedMap<u64, Project>,
}

#[near_bindgen]
impl Nearboard {
    #[init]
    pub fn new() -> Self {
        Self {
            current_id: 0,
            projects: UnorderedMap::new(b"p".to_vec()),
        }
    }

    pub fn add_project(&mut self, params: AddProjectParams) -> u64 {
        self.current_id += 1;
        let project = Project {
            id: self.current_id,
            owner: env::signer_account_id(),
            name: params.name,
            description: params.description,
            image: params.image,
        };

        self.projects.insert(&project.id, &project);

        project.id
    }

    pub fn get_all_projects(&self) -> Vec<Project> {
        let mut projects = Vec::new();
        for project in self.projects.iter() {
            projects.push(project.1);
        }

        projects
    }

    pub fn get_project(&self, project_id: u64) -> Project {
        self.projects.get(&project_id).unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{testing_env, VMContext};

    fn get_context(signer_account_id: AccountId, is_view: bool) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(signer_account_id)
            .is_view(is_view)
            .build()
    }

    fn alice() -> AccountId {
        "alice".parse().unwrap()
    }

    fn create_project(contract: &mut Nearboard) -> u64 {
        let mock_data = AddProjectParams {
            owner: env::signer_account_id(),
            name: "Project name".to_string(),
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent molestie augue eu sem mollis, tincidunt.".to_string(),
            image: "http://example.com".to_string(),
        };

        let project_id = contract.add_project(mock_data);

        project_id
    }

    #[test]
    fn test_add_project() {
        let context = get_context(alice(), false);
        testing_env!(context);

        let mut nearkick = Nearboard::new();

        let project_id = create_project(&mut nearkick);
        assert_eq!(nearkick.projects.get(&project_id).unwrap().id, project_id);
    }
}
