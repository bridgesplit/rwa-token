/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/policy_engine.json`.
 */
export type PolicyEngine = {
  "address": "po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau",
  "metadata": {
    "name": "policyEngine",
    "version": "0.0.1",
    "spec": "0.1.0",
    "description": "The Policy Registry Program (PRP) enables the creation of policies that can be used to control the flow of funds in a programmatic way."
  },
  "instructions": [
    {
      "name": "attachToPolicyAccount",
      "docs": [
        "attach a policy"
      ],
      "discriminator": [
        247,
        116,
        130,
        17,
        89,
        232,
        103,
        16
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "policyEngine",
          "writable": true
        },
        {
          "name": "policyAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "policyEngine"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "identityFilter",
          "type": {
            "defined": {
              "name": "identityFilter"
            }
          }
        },
        {
          "name": "policyType",
          "type": {
            "defined": {
              "name": "policyType"
            }
          }
        }
      ]
    },
    {
      "name": "createPolicyAccount",
      "docs": [
        "policies",
        "create policy account"
      ],
      "discriminator": [
        52,
        228,
        143,
        138,
        102,
        135,
        59,
        193
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "policyEngine",
          "writable": true
        },
        {
          "name": "policyAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "policyEngine"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "identityFilter",
          "type": {
            "defined": {
              "name": "identityFilter"
            }
          }
        },
        {
          "name": "policyType",
          "type": {
            "defined": {
              "name": "policyType"
            }
          }
        }
      ]
    },
    {
      "name": "createPolicyEngine",
      "docs": [
        "create a policy registry"
      ],
      "discriminator": [
        85,
        105,
        207,
        153,
        73,
        125,
        225,
        54
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "assetMint"
        },
        {
          "name": "policyEngineAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "extraMetasAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "pubkey"
        },
        {
          "name": "delegate",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "createTrackerAccount",
      "docs": [
        "create tracker account"
      ],
      "discriminator": [
        40,
        16,
        40,
        191,
        109,
        177,
        83,
        190
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner"
        },
        {
          "name": "assetMint"
        },
        {
          "name": "trackerAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": []
    },
    {
      "name": "detachFromPolicyAccount",
      "docs": [
        "remove policy"
      ],
      "discriminator": [
        81,
        24,
        116,
        10,
        12,
        108,
        109,
        242
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "policyEngine",
          "writable": true
        },
        {
          "name": "policyAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "policyEngine"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "hash",
          "type": "string"
        }
      ]
    },
    {
      "name": "executeTransaction",
      "docs": [
        "execute transfer hook"
      ],
      "discriminator": [
        105,
        37,
        101,
        197,
        75,
        251,
        102,
        26
      ],
      "accounts": [
        {
          "name": "sourceAccount"
        },
        {
          "name": "assetMint"
        },
        {
          "name": "destinationAccount"
        },
        {
          "name": "ownerDelegate"
        },
        {
          "name": "extraMetasAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "policyEngineAccount"
        },
        {
          "name": "identityRegistry",
          "address": "idtynCMYbdisCTv4FrCWPSQboZb1uM4TV2cPi79yxQf"
        },
        {
          "name": "identityRegistryAccount"
        },
        {
          "name": "receiverIdentityAccount"
        },
        {
          "name": "trackerAccount",
          "writable": true
        },
        {
          "name": "policyAccount",
          "writable": true
        },
        {
          "name": "instructionsProgram"
        },
        {
          "name": "sourceIdentityAccount"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "policyAccount",
      "discriminator": [
        218,
        201,
        183,
        164,
        156,
        127,
        81,
        175
      ]
    },
    {
      "name": "policyEngineAccount",
      "discriminator": [
        124,
        85,
        205,
        80,
        2,
        18,
        26,
        45
      ]
    },
    {
      "name": "trackerAccount",
      "discriminator": [
        83,
        95,
        166,
        148,
        57,
        30,
        90,
        210
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidPolicy",
      "msg": "Invalid policy passed"
    },
    {
      "code": 6001,
      "name": "transactionAmountLimitExceeded",
      "msg": "Transaction amount limit exceeded"
    },
    {
      "code": 6002,
      "name": "transactionAmountVelocityExceeded",
      "msg": "Transaction amount velocity exceeded"
    },
    {
      "code": 6003,
      "name": "transactionCountVelocityExceeded",
      "msg": "Transaction count velocity exceeded"
    },
    {
      "code": 6004,
      "name": "identityLevelLimitExceeded",
      "msg": "Identity level limit exceeded"
    },
    {
      "code": 6005,
      "name": "policyEngineFull",
      "msg": "Policy registry is full, cannot add more policies"
    },
    {
      "code": 6006,
      "name": "policyNotFound",
      "msg": "Policy not found"
    },
    {
      "code": 6007,
      "name": "identityFilterFailed",
      "msg": "Identity filter failed"
    },
    {
      "code": 6008,
      "name": "unauthorizedSigner",
      "msg": "Unauthorized signer"
    },
    {
      "code": 6009,
      "name": "policyAlreadyExists",
      "msg": "Policy already exists"
    },
    {
      "code": 6010,
      "name": "maxBalanceExceeded",
      "msg": "Max balance exceeded"
    },
    {
      "code": 6011,
      "name": "invalidCpiTransferAmount",
      "msg": "Invalid CPI transfer amount"
    },
    {
      "code": 6012,
      "name": "invalidCpiTransferMint",
      "msg": "Invalid CPI transfer mint"
    },
    {
      "code": 6013,
      "name": "invalidCpiTransferProgram",
      "msg": "Invalid CPI transfer program"
    },
    {
      "code": 6014,
      "name": "invalidPdaPassedIn",
      "msg": "Invalid PDA passed in"
    },
    {
      "code": 6015,
      "name": "transferHistoryFull",
      "msg": "Transfer history full"
    },
    {
      "code": 6016,
      "name": "transferPaused",
      "msg": "All Transfers have been paused"
    },
    {
      "code": 6017,
      "name": "forceFullTransfer",
      "msg": "Expected source account to transfer full amount"
    },
    {
      "code": 6018,
      "name": "holderLimitExceeded",
      "msg": "Holder limit exceeded"
    },
    {
      "code": 6019,
      "name": "balanceLimitExceeded",
      "msg": "Balance limit exceeded"
    }
  ],
  "types": [
    {
      "name": "comparisionType",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "or"
          },
          {
            "name": "and"
          }
        ]
      }
    },
    {
      "name": "identityFilter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identityLevels",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "comparisionType",
            "type": {
              "defined": {
                "name": "comparisionType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "policy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": "string"
          },
          {
            "name": "identityFilter",
            "type": {
              "defined": {
                "name": "identityFilter"
              }
            }
          },
          {
            "name": "policyType",
            "type": {
              "defined": {
                "name": "policyType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "policyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "policyEngine",
            "docs": [
              "Engine account that the policy belongs to"
            ],
            "type": "pubkey"
          },
          {
            "name": "policies",
            "docs": [
              "Different policies that can be applied to the policy account",
              "initial max len"
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "policy"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "policyEngineAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "version"
            ],
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "asset mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "authority of the registry"
            ],
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "docs": [
              "policy delegate"
            ],
            "type": "pubkey"
          },
          {
            "name": "maxTimeframe",
            "docs": [
              "max timeframe of all the policies"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "policyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "identityApproval"
          },
          {
            "name": "transactionAmountLimit",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              }
            ]
          },
          {
            "name": "transactionAmountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          },
          {
            "name": "transactionCountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          },
          {
            "name": "maxBalance",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              }
            ]
          },
          {
            "name": "transferPause"
          },
          {
            "name": "forceFullTransfer"
          },
          {
            "name": "holderLimit",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "currentHolders",
                "type": "u64"
              }
            ]
          },
          {
            "name": "balanceLimit",
            "fields": [
              {
                "name": "limit",
                "type": "u128"
              },
              {
                "name": "currentBalance",
                "type": "u128"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "trackerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "transfers",
            "type": {
              "vec": {
                "defined": {
                  "name": "transfer"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "transfer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
