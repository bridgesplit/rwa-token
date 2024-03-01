export type IdentityRegistry = {
  "version": "0.0.1",
  "name": "identity_registry",
  "instructions": [
    {
      "name": "createIdentityRegistry",
      "docs": [
        "registry functions",
        "create identity registry"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "publicKey"
        },
        {
          "name": "delegate",
          "type": {
            "option": "publicKey"
          }
        }
      ]
    },
    {
      "name": "delegateIdentityRegsitry",
      "docs": [
        "delegate identity registry"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "identityRegistryAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "delegate",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createIdentityAccount",
      "docs": [
        "identity functions",
        "create identity account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addLevelToIdentityAccount",
      "docs": [
        "add level to identity account"
      ],
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "removeLevelFromIdentityAccount",
      "docs": [
        "remove level from identity account"
      ],
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "revokeIdentityAccount",
      "docs": [
        "revoke user identity account by closing account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "identityRegistryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "corresponding asset mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "authority",
            "docs": [
              "authority to manage the registry"
            ],
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "docs": [
              "registry delegate"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "identityAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "registry",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "levels",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "LevelAlreadyPresent",
      "msg": "Identity level has already been attached to user"
    },
    {
      "code": 6001,
      "name": "MaxLevelsExceeded",
      "msg": "Number of levels that can be attached to user has been exceeded"
    },
    {
      "code": 6002,
      "name": "LevelNotFound",
      "msg": "Level to be removed not found"
    },
    {
      "code": 6003,
      "name": "UnauthorizedSigner",
      "msg": "Unauthorized signer"
    }
  ]
};

export const IDL: IdentityRegistry = {
  "version": "0.0.1",
  "name": "identity_registry",
  "instructions": [
    {
      "name": "createIdentityRegistry",
      "docs": [
        "registry functions",
        "create identity registry"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "publicKey"
        },
        {
          "name": "delegate",
          "type": {
            "option": "publicKey"
          }
        }
      ]
    },
    {
      "name": "delegateIdentityRegsitry",
      "docs": [
        "delegate identity registry"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "identityRegistryAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "delegate",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createIdentityAccount",
      "docs": [
        "identity functions",
        "create identity account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addLevelToIdentityAccount",
      "docs": [
        "add level to identity account"
      ],
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "removeLevelFromIdentityAccount",
      "docs": [
        "remove level from identity account"
      ],
      "accounts": [
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        },
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "revokeIdentityAccount",
      "docs": [
        "revoke user identity account by closing account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "identityRegistryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "corresponding asset mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "authority",
            "docs": [
              "authority to manage the registry"
            ],
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "docs": [
              "registry delegate"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "identityAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "registry",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "levels",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "LevelAlreadyPresent",
      "msg": "Identity level has already been attached to user"
    },
    {
      "code": 6001,
      "name": "MaxLevelsExceeded",
      "msg": "Number of levels that can be attached to user has been exceeded"
    },
    {
      "code": 6002,
      "name": "LevelNotFound",
      "msg": "Level to be removed not found"
    },
    {
      "code": 6003,
      "name": "UnauthorizedSigner",
      "msg": "Unauthorized signer"
    }
  ]
};
