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
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
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
          "type": "publicKey"
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
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "legalRegistry",
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
      "name": "addLevelIdentityAccount",
      "docs": [
        "add level to identity account"
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
      "name": "removeLevelIdentityAccount",
      "docs": [
        "remove level from identity account"
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
      "name": "revokeIdentityAccount",
      "docs": [
        "revoke level from identity account"
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
      "name": "identityRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "delegate",
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
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
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
          "type": "publicKey"
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
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "legalRegistry",
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
      "name": "addLevelIdentityAccount",
      "docs": [
        "add level to identity account"
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
      "name": "removeLevelIdentityAccount",
      "docs": [
        "remove level from identity account"
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
      "name": "revokeIdentityAccount",
      "docs": [
        "revoke level from identity account"
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
      "name": "identityRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "delegate",
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
